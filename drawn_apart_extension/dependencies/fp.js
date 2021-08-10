
(function() {
  api.register('webGL_drawnApart', function () {
    try {
      const timeoutCollectAttribute = new Promise(function (resolve, reject) {
        setTimeout(resolve, 60 * 1000, 'Timeout');
      });
      const getValue = new Promise(function (resolve, reject) {
        var worker = new Worker(chrome.runtime.getURL('dependencies/webgl-worker.js'));
        worker.addEventListener('message', function (msg) {
          resolve(msg.data);
        });

        // Tell the worker to start.
        worker.postMessage("prepare and go!");
      });
      return Promise.race([getValue, timeoutCollectAttribute]);
    } catch (e) {
      return 'Not supported';
    }
  });
})();

(function() {
  api.register(['webGLRenderer', 'webGLData'], function() {
    let webGLRenderer;
    let webGLData;
    const fa2s = function(fa) {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      return '[' + fa[0] + ', ' + fa[1] + ']';
    };

    const generateWebGLData = function(gl) {
      try {
        const vShaderTemplate = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}';
        const fShaderTemplate = 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}';
        const vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        const vertices = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        vertexPosBuffer.itemSize = 3;
        vertexPosBuffer.numItems = 3;
        const program = gl.createProgram(); const vshader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vshader, vShaderTemplate);
        gl.compileShader(vshader);
        const fshader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fshader, fShaderTemplate);
        gl.compileShader(fshader);
        gl.attachShader(program, vshader);
        gl.attachShader(program, fshader);
        gl.linkProgram(program);
        gl.useProgram(program);
        program.vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex');
        program.offsetUniform = gl.getUniformLocation(program, 'uniformOffset');
        gl.enableVertexAttribArray(program.vertexPosArray);
        gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
        gl.uniform2f(program.offsetUniform, 1, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
        if (gl.canvas != null) {
          return gl.canvas.toDataURL();
        }
      } catch (e) {
        return 'Not supported';
      }
    };

    var maxAnisotropy = function(gl) {
      let anisotropy; const ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
      return ext ? (anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === anisotropy && (anisotropy = 2), anisotropy) : null;
    };
    try {
      canvas = document.createElement('canvas');
      var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl.getSupportedExtensions().indexOf('WEBGL_debug_renderer_info') >= 0) {

        try {
          webGLRenderer = gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL);
        } catch (e) {
          webGLRenderer = window.not_supported;
        }


        webGLData = generateWebGLData(gl);
      } else {
        webGLRenderer = window.not_supported;
        webGLData = window.not_supported;
      }
    } catch (e) {
      webGLRenderer = window.not_supported;
      webGLData = window.not_supported;
    }

    return {
      webGLRenderer: webGLRenderer,
      webGLData: webGLData,
    };
  });
})();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

