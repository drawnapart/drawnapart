# Drawn Apart extension

## How to install the extension in your browser

First, you have to get the content of the extension by cloning this repository with a `git clone` or `git pull`.

#### For Firefox
  1. Go to the [about:debugging](about:debugging) page on your browser.

  2. Click on the link **This Firefox**.

  3. Click on the button **Load Temporary Add-on...**.

  4. Go into the extension directory and select any file from its root folder. The extension is then loaded in the browser.

#### For Chrome / Chromium
  1. Go on the [chrome://extensions/](chrome://extensions/) page on your browser.

  2. If developer mode is not enabled, then enable it on the top right of the browser window.

  3. Click on the button **Load unpacked extension...**.

  4. Select the extension's directory and the extension is then loaded in the browser.

## The Drawn Apart experiment

The data collection is located in **dependencies/fp.js**.
We collect 3 attributes: the WebGL Renderer, the WebGL Data that we later hash, and the traces from the Drawn Apart technique.
The Drawn Apart collection function creates a worker, runs it, and gets the results of the collection (see **dependencies/webgl-worker.js**).
