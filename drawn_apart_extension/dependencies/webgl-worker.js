(async function() {
    let numOfVertices = 10;
    let numOfSamplesPerVertex = 1;
    let autoReload = 1;
    let pcid = "UNKNOWN";
    let stallVertexIdLocation;
    let offscreenCan;
    let gl;

    let test_selector;
    let cur_stall_func = 0;

    // DRAWNAPART code here
    const fragment_code =
        `#version 300 es
    precision mediump float;
    flat in int dis;
    in vec3 colorFrag;
    out vec4 outColor;

    void main(void)
    {
        outColor = vec4(colorFrag, 1.0);
    }
    `;
    const vertex_code =
        `#version 300 es
    in vec2 coordinates;
    out vec3 colorFrag;
    uniform int cur_stalled_vertex;
    uniform int test_selector;

    float stall_function_sinh()
    {
      float res = 15.0;

      for (int i = 1; i < 0xfff; i++)
      {
          res = sinh(res);
      }

      return res;
    }

    void main(void)
    {
        if ((cur_stalled_vertex & (1 << gl_VertexID)) != 0)
        {
            float res = stall_function_sinh();

            colorFrag = vec3(1, 0, res / 255.0);
        }
        else
        {
            colorFrag = vec3(0, 1, 0);
        }

        gl_Position = vec4(coordinates, 1.0, 1.0);
    }
    `;



    // Prepare to draw
    function prepareToDraw(gl, vertexCount) {
        const vertices = new Array;
        for (i = 0; i < vertexCount; i++) {
            vertices.push(0);
            vertices.push(0);
        }

        const vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // Vertex shader
        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertex_code);
        gl.compileShader(vertShader);
        let compiled = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
        if (!compiled) {
            console.error(gl.getShaderInfoLog(vertShader));
            //TODO: THROW ERROR
        }

        // Fragment shader
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragment_code);
        gl.compileShader(fragShader);
        compiled = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
        if (!compiled) {
            console.error(gl.getShaderInfoLog(fragShader));
            //TODO: THROW ERROR
        }

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

        const coord = gl.getAttribLocation(shaderProgram, "coordinates");
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(coord);
        const instance_buffer = gl.createBuffer();
        const instances = [0.0, 1.0, 0.0, 1.0];
        gl.bindBuffer(gl.ARRAY_BUFFER, instance_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(instances), gl.STATIC_DRAW);

        stallVertexIdLocation = gl.getUniformLocation(shaderProgram, "cur_stalled_vertex");

        test_selector = gl.getUniformLocation(shaderProgram, "test_selector");
        gl.uniform1i(test_selector, cur_stall_func);

    }


//    window.onload = prepareAndGo;

    function getParam(name, defaultValue) {
        if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
            return decodeURIComponent(name[1]);
        else
            return defaultValue;
    }


    async function prepareAndGo() {
        return new Promise(function(resolve, reject) {
            // Initalize the offscreen canvas
            offscreenCan = new OffscreenCanvas(1, 1);
            gl = offscreenCan.getContext("webgl2", { antialias: false });


            // Parse out the query parameters
            numOfVertices = getParam('numOfVert', numOfVertices);
            numOfSamplesPerVertex = getParam('numOfSampPerVert', numOfSamplesPerVertex);
            pcid = getParam('pcid', pcid);
            autoReload = getParam('autoReload', autoReload);

            // Prepare to draw
            prepareToDraw(gl, numOfVertices);

            // Don't start immediately, wait for the event queue to clear
            setTimeout(function() {
                resolve(go(gl))
            }, 0);
        });
    }

    async function measureVertex(gl, vertexMask) {
        // Configure the stalled vertex index
        gl.uniform1i(stallVertexIdLocation, vertexMask);

        // Measure time
        gl.drawArrays(gl.POINTS, 0, numOfVertices);

        const beforeRender = performance.now();
        blob = await offscreenCan.convertToBlob();
        const afterRender = performance.now();

        return afterRender - beforeRender;
    }


    async function go(gl) {
        const startTime = performance.now();


        const operator_traces = [];

        // for each vertex combination
        for (vertexMask = 0; vertexMask < (1 << numOfVertices); vertexMask++) {
            var stallTime = await measureVertex(gl, vertexMask);
            operator_traces.push(stallTime);
        }

        const endTime = performance.now();


        return operator_traces;
        /*
        const xhr = new XMLHttpRequest();
        xhr.open("POST", COLLECTION_SERVER_URL);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        // reload the page after we finish
        xhr.onreadystatechange = function () {
            if ((xhr.readyState === 4) && (autoReload !== "0")) {
                location.reload();
            }
        };

        xhr.send(JSON.stringify(traceArray));
        */
    }

    let resultsArray, currResults;
    onmessage = async function(e) {
        try {
            if (e.data === "prepare and go!") {
                resultsArray = await prepareAndGo();
                for (let i = 0; i < 6; i++) {
                    currResults = await go(gl);
                    resultsArray = resultsArray.concat(currResults);
                }
            } else {
                resultsArray = []
                for (let i = 0; i < 7; i++) {
                    currResults = await go(gl);
                    resultsArray = resultsArray.concat(currResults);
                }
            }
            gl.getExtension('WEBGL_lose_context').loseContext();
            postMessage(resultsArray);
        } catch (e) {
            postMessage('Not supported')
        }
    }
})();
