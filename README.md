# Drawn Apart

Artifact for NDSS submission #93 "DRAWN APART : A Device Identification Technique based on Remote GPU Fingerprinting"

## Demo pages

You will find below three distinct demo pages, each testing a different timing measurement method.
* [**Onscreen**](https://drawnapart.github.io/drawnapart/standalone_demos/onscreen.html) 
* [**Offscreen**](https://drawnapart.github.io/drawnapart/standalone_demos/offscreen.html) (Chromium-based browsers only)
* [**GPU**](https://drawnapart.github.io/drawnapart/standalone_demos/gpu.html) (Chromium-based browsers only)

Note that both the **GPU** and **Offscreen** methods are only available by default at the moment on Chromium-based browsers
(see progress on the support of OffscreenCanvas for [Firefox](https://bugzilla.mozilla.org/show_bug.cgi?id=1390089) and [Safari](https://bugs.webkit.org/show_bug.cgi?id=183720)).



## Python notebook

Our classification over real data can be viewed using the interactive Python notebook at the following link:
[https://colab.research.google.com/github/DrawnApart/DrawnApart/blob/master/drawnapart_demo.ipynb](https://colab.research.google.com/github/DrawnApart/DrawnApart/blob/master/drawnapart_demo.ipynb)

The raw data is contained in the different _tgz_ files present at the root of this repository.

The revisited FPStalker code with DrawnApart is also available at the root of this repository, under the name "fpstalker_drawnapart.ipynb". For privacy-related reasons, we use a bogus dataset for the execution.
It can be executed by visiting the interactive notebook at the following link:  
[https://colab.research.google.com/github/DrawnApart/DrawnApart/blob/master/fpstalker_drawnapart.ipynb](https://colab.research.google.com/github/DrawnApart/DrawnApart/blob/master/fpstalker_drawnapart.ipynb)

## Videos

To assess the robustness of our Drawn Apart method, we filmed two experiments where we swapped hardware between two computers.
* [**HDD swapping demo**](https://drive.google.com/file/d/1MtRrCQ3lHW4ferMXqLRlAPcfNr2j5or-/view) 
* [**CPU swapping demo**](https://drive.google.com/file/d/1dq_Bj4tG2fuWROLR9Uj9PPj9kBijEuWk/view)



