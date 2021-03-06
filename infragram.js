// Generated by CoffeeScript 1.6.3
var JsImage, b_exp, camera, colorify, colormap, colormap1, createBuffer, createContext, createTexture, drawScene, g_exp, generateShader, getURLParameter, get_channels, glHandleOnChangeFile, glHandleOnClickColor, glHandleOnClickDownload, glHandleOnClickGrey, glHandleOnClickNdvi, glHandleOnClickRaw, glHandleOnLoadTexture, glHandleOnSlide, glHandleOnSubmitInfra, glHandleOnSubmitInfraHsv, glHandleOnSubmitInfraMono, glInitInfragram, glRestoreContext, glSetMode, glShaderLoaded, glUpdateImage, greyscale_colormap, histogram, hsv2rgb, image, imgContext, infragrammar, jsHandleOnChangeFile, jsHandleOnClickColor, jsHandleOnClickDownload, jsHandleOnClickGrey, jsHandleOnClickNdvi, jsHandleOnClickRaw, jsHandleOnSlide, jsHandleOnSubmitInfra, jsHandleOnSubmitInfraHsv, jsHandleOnSubmitInfraMono, jsUpdateImage, m_exp, mapContext, mode, modeToEquationMap, ndvi, r_exp, render, rgb2hsv, save_expressions, save_expressions_hsv, segmented_colormap, setParametersFromURL, set_mode, update, updateImage, update_colorbar, vertices, waitForShadersToLoad, webGlSupported,
  _this = this;

image = null;

mode = "raw";

r_exp = "";

g_exp = "";

b_exp = "";

m_exp = "";

JsImage = (function() {
  function JsImage(data, width, height, channels) {
    this.data = data;
    this.width = width;
    this.height = height;
    this.channels = channels;
  }

  JsImage.prototype.copyToImageData = function(imgData) {
    return imgData.data.set(this.data);
  };

  JsImage.prototype.extrema = function() {
    var c, i, j, maxs, mins, n, _i, _j, _ref;
    n = this.width * this.height;
    mins = (function() {
      var _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.channels; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.data[i]);
      }
      return _results;
    }).call(this);
    maxs = (function() {
      var _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.channels; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _results.push(this.data[i]);
      }
      return _results;
    }).call(this);
    j = 0;
    for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
      for (c = _j = 0, _ref = this.channels; 0 <= _ref ? _j < _ref : _j > _ref; c = 0 <= _ref ? ++_j : --_j) {
        if (this.data[j] > maxs[c]) {
          maxs[c] = this.data[j];
        }
        if (this.data[j] < mins[c]) {
          mins[c] = this.data[j];
        }
        j++;
      }
    }
    return [mins, maxs];
  };

  return JsImage;

})();

histogram = function(array, _arg, nbins) {
  var a, bins, d, i, max, min, _i, _len;
  min = _arg[0], max = _arg[1];
  bins = (function() {
    var _i, _results;
    _results = [];
    for (i = _i = 0; 0 <= nbins ? _i < nbins : _i > nbins; i = 0 <= nbins ? ++_i : --_i) {
      _results.push(0);
    }
    return _results;
  })();
  d = (max - min) / nbins;
  for (_i = 0, _len = array.length; _i < _len; _i++) {
    a = array[_i];
    i = Math.floor((a - min) / d);
    if ((0 <= i && i < nbins)) {
      bins[i]++;
    }
  }
  return bins;
};

segmented_colormap = function(segments) {
  return function(x) {
    var i, result, x0, x1, xstart, y0, y1, _i, _j, _len, _ref, _ref1, _ref2, _ref3;
    _ref = [0, 0], y0 = _ref[0], y1 = _ref[1];
    _ref1 = [segments[0][0], 1], x0 = _ref1[0], x1 = _ref1[1];
    if (x < x0) {
      return y0;
    }
    for (i = _i = 0, _len = segments.length; _i < _len; i = ++_i) {
      _ref2 = segments[i], xstart = _ref2[0], y0 = _ref2[1], y1 = _ref2[2];
      x0 = xstart;
      if (i === segments.length - 1) {
        x1 = 1;
        break;
      }
      x1 = segments[i + 1][0];
      if ((xstart <= x && x < x1)) {
        break;
      }
    }
    result = [];
    for (i = _j = 0, _ref3 = y0.length; 0 <= _ref3 ? _j < _ref3 : _j > _ref3; i = 0 <= _ref3 ? ++_j : --_j) {
      result[i] = (x - x0) / (x1 - x0) * (y1[i] - y0[i]) + y0[i];
    }
    return result;
  };
};

get_channels = function(img) {
  var b, g, i, mkImage, n, r, _i;
  n = img.width * img.height;
  r = new Float32Array(n);
  g = new Float32Array(n);
  b = new Float32Array(n);
  for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
    r[i] = img.data[4 * i + 0];
    g[i] = img.data[4 * i + 1];
    b[i] = img.data[4 * i + 2];
  }
  mkImage = function(d) {
    return new JsImage(d, img.width, img.height, 1);
  };
  return [mkImage(r), mkImage(g), mkImage(b)];
};

ndvi = function(nir, vis) {
  var d, i, n, _i;
  n = nir.width * nir.height;
  d = new Float64Array(n);
  for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
    d[i] = (nir.data[i] - vis.data[i]) / (nir.data[i] + vis.data[i]);
  }
  return new JsImage(d, nir.width, nir.height, 1);
};

colorify = function(img, colormap) {
  var b, cimg, data, g, i, j, n, r, _i, _ref;
  n = img.width * img.height;
  data = new Uint8ClampedArray(4 * n);
  j = 0;
  for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
    _ref = colormap(img.data[i]), r = _ref[0], g = _ref[1], b = _ref[2];
    data[j++] = r;
    data[j++] = g;
    data[j++] = b;
    data[j++] = 255;
  }
  cimg = new JsImage();
  cimg.width = img.width;
  cimg.height = img.height;
  cimg.data = data;
  return new JsImage(data, img.width, img.height, 4);
};

infragrammar = function(img) {
  var b, g, i, n, o, r, _i;
  n = img.width * img.height;
  r = new Float32Array(n);
  g = new Float32Array(n);
  b = new Float32Array(n);
  o = new Float64Array(4 * n);
  for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
    r[i] = img.data[4 * i + 0] / 255;
    g[i] = img.data[4 * i + 1] / 255;
    b[i] = img.data[4 * i + 2] / 255;
    o[4 * i + 0] = 255 * r_exp(r[i], g[i], b[i]);
    o[4 * i + 1] = 255 * g_exp(r[i], g[i], b[i]);
    o[4 * i + 2] = 255 * b_exp(r[i], g[i], b[i]);
    o[4 * i + 3] = 255;
  }
  return new JsImage(o, img.width, img.height, 4);
};

render = function(img) {
  var ctx, d, e;
  e = document.getElementById("image");
  e.width = img.width;
  e.height = img.height;
  ctx = e.getContext("2d");
  d = ctx.getImageData(0, 0, img.width, img.height);
  img.copyToImageData(d);
  return ctx.putImageData(d, 0, 0);
};

greyscale_colormap = segmented_colormap([[0, [0, 0, 0], [255, 255, 255]], [1, [255, 255, 255], [255, 255, 255]]]);

colormap1 = segmented_colormap([[0, [0, 0, 255], [38, 195, 195]], [0.5, [0, 150, 0], [255, 255, 0]], [0.75, [255, 255, 0], [255, 50, 50]]]);

colormap = greyscale_colormap;

update_colorbar = function(min, max) {
  var b, ctx, d, e, g, i, j, k, r, _i, _j, _ref, _ref1, _ref2;
  $('#colorbar-container')[0].style.display = 'inline-block';
  e = $('#colorbar')[0];
  ctx = e.getContext("2d");
  d = ctx.getImageData(0, 0, e.width, e.height);
  for (i = _i = 0, _ref = e.width; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    for (j = _j = 0, _ref1 = e.height; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
      _ref2 = colormap(i / e.width), r = _ref2[0], g = _ref2[1], b = _ref2[2];
      k = 4 * (i + j * e.width);
      d.data[k + 0] = r;
      d.data[k + 1] = g;
      d.data[k + 2] = b;
      d.data[k + 3] = 255;
    }
  }
  ctx.putImageData(d, 0, 0);
  $("#colorbar-min")[0].textContent = min.toFixed(2);
  return $("#colorbar-max")[0].textContent = max.toFixed(2);
};

update = function(img) {
  var b, g, max, min, ndvi_img, normalize, r, result, _ref, _ref1;
  $('#colorbar-container')[0].style.display = 'none';
  if (mode === "ndvi") {
    _ref = get_channels(img), r = _ref[0], g = _ref[1], b = _ref[2];
    ndvi_img = ndvi(r, b);
    min = -1;
    max = 1;
    normalize = function(x) {
      return (x - min) / (max - min);
    };
    result = colorify(ndvi_img, function(x) {
      return colormap(normalize(x));
    });
    update_colorbar(min, max);
  } else if (mode === "raw") {
    result = new JsImage(img.data, img.width, img.height, 4);
  } else if (mode === "nir") {
    _ref1 = get_channels(img), r = _ref1[0], g = _ref1[1], b = _ref1[2];
    result = colorify(r, function(x) {
      return [x, x, x];
    });
  } else {
    result = infragrammar(img);
  }
  $('#download').show();
  return render(result);
};

save_expressions = function(r, g, b) {
  r = r.toUpperCase().replace(/X/g, $('#slider').val() / 100);
  g = g.toUpperCase().replace(/X/g, $('#slider').val() / 100);
  b = b.toUpperCase().replace(/X/g, $('#slider').val() / 100);
  if (r === "") {
    r = "R";
  }
  if (g === "") {
    g = "G";
  }
  if (b === "") {
    b = "B";
  }
  eval("r_exp = function(R,G,B){return " + r + ";}");
  eval("g_exp = function(R,G,B){return " + g + ";}");
  return eval("b_exp = function(R,G,B){return " + b + ";}");
};

save_expressions_hsv = function(h, s, v) {
  h = h.toUpperCase().replace(/X/g, $('#slider').val() / 100);
  s = s.toUpperCase().replace(/X/g, $('#slider').val() / 100);
  v = v.toUpperCase().replace(/X/g, $('#slider').val() / 100);
  if (h === "") {
    h = "H";
  }
  if (s === "") {
    s = "S";
  }
  if (v === "") {
    v = "V";
  }
  eval("r_exp = function(R,G,B){var hsv = rgb2hsv(R, G, B), H = hsv[0], S = hsv[1], V = hsv[2]; return hsv2rgb(" + h + "," + s + "," + v + ")[0];}");
  eval("g_exp = function(R,G,B){var hsv = rgb2hsv(R, G, B), H = hsv[0], S = hsv[1], V = hsv[2]; return hsv2rgb(" + h + "," + s + "," + v + ")[1];}");
  return eval("b_exp = function(R,G,B){var hsv = rgb2hsv(R, G, B), H = hsv[0], S = hsv[1], V = hsv[2]; return hsv2rgb(" + h + "," + s + "," + v + ")[2];}");
};

hsv2rgb = function(h, s, v) {
  var data, f, i, p, q, rgb, t;
  data = [];
  if (s === 0) {
    rgb = [v, v, v];
  } else {
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    data = [v * (1 - s), v * (1 - s * (h - i)), v * (1 - s * (1 - (h - i)))];
    switch (i) {
      case 0:
        rgb = [v, t, p];
        break;
      case 1:
        rgb = [q, v, p];
        break;
      case 2:
        rgb = [p, v, t];
        break;
      case 3:
        rgb = [p, q, v];
        break;
      case 4:
        rgb = [t, p, v];
        break;
      default:
        rgb = [v, p, q];
    }
  }
  return rgb;
};

rgb2hsv = function(r, g, b) {
  var d, h, max, min, s, v;
  max = Math.max(r, g, b);
  min = Math.min(r, g, b);
  h = s = v = max;
  d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return [h, s, v];
};

set_mode = function(new_mode) {
  mode = new_mode;
  update(image);
  if (mode === "ndvi") {
    return $("#colormaps-group")[0].style.display = "inline-block";
  } else {
    return $("#colormaps-group")[0].style.display = "none";
  }
};

jsUpdateImage = function(video) {
  var ctx, e;
  e = document.createElement("canvas");
  e.width = video.videoWidth;
  e.height = video.videoHeight;
  ctx = e.getContext("2d");
  ctx.drawImage(video, 0, 0);
  image = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
  return set_mode(mode);
};

jsHandleOnChangeFile = function(files) {
  var file_reader;
  if (files && files[0]) {
    file_reader = new FileReader();
    file_reader.onload = function(eventObject) {
      var img;
      img = new Image();
      img.onload = function(event) {
        var ctx, e;
        e = document.createElement("canvas");
        e.width = img.width;
        e.height = img.height;
        ctx = e.getContext("2d");
        ctx.drawImage(img, 0, 0);
        image = ctx.getImageData(0, 0, img.width, img.height);
        return update(image);
      };
      return img.src = eventObject.target.result;
    };
    return file_reader.readAsDataURL(files[0]);
  }
};

jsHandleOnClickRaw = function() {
  return set_mode("raw");
};

jsHandleOnClickNdvi = function() {
  return set_mode("ndvi");
};

jsHandleOnClickDownload = function() {
  var ctx, e, event, lnk;
  e = document.getElementById("image");
  ctx = e.getContext("2d");
  lnk = document.createElement("a");
  lnk.download = (new Date()).toISOString().replace(/:/g, "_") + ".png";
  lnk.href = ctx.canvas.toDataURL("image/png");
  if (document.createEvent) {
    event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    return lnk.dispatchEvent(event);
  } else if (lnk.fireEvent) {
    return lnk.fireEvent("onclick");
  }
};

jsHandleOnSubmitInfraHsv = function() {
  save_expressions_hsv($('#h_exp').val(), $('#s_exp').val(), $('#v_exp').val());
  return set_mode("infragrammar_hsv");
};

jsHandleOnSubmitInfra = function() {
  save_expressions($('#r_exp').val(), $('#g_exp').val(), $('#b_exp').val());
  return set_mode("infragrammar");
};

jsHandleOnSubmitInfraMono = function() {
  save_expressions($('#m_exp').val(), $('#m_exp').val(), $('#m_exp').val());
  return set_mode("infragrammar_mono");
};

jsHandleOnClickGrey = function() {
  colormap = greyscale_colormap;
  return update(image);
};

jsHandleOnClickColor = function() {
  colormap = colormap1;
  return update(image);
};

jsHandleOnSlide = function(event) {
  if (mode === "infragrammar") {
    save_expressions($('#r_exp').val(), $('#g_exp').val(), $('#b_exp').val());
  } else if (mode === "infragrammar_hsv") {
    save_expressions_hsv($('#h_exp').val(), $('#s_exp').val(), $('#v_exp').val());
  } else {
    save_expressions($('#m_exp').val(), $('#m_exp').val(), $('#m_exp').val());
  }
  return update(image);
};

modeToEquationMap = {
  "hsv": ["#h_exp", "#s_exp", "#v_exp"],
  "rgb": ["#r_exp", "#g_exp", "#b_exp"],
  "mono": ["#m_exp", "#m_exp", "#m_exp"],
  "raw": ["r", "g", "b"],
  "ndvi": ["(((r-b)/(r+b))+1)/2", "(((r-b)/(r+b))+1)/2", "(((r-b)/(r+b))+1)/2"],
  "nir": ["r", "r", "r"]
};

vertices = [-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0];

vertices.itemSize = 2;

waitForShadersToLoad = 0;

imgContext = null;

mapContext = null;

createBuffer = function(ctx, data) {
  var buffer, gl;
  gl = ctx.gl;
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  buffer.itemSize = data.itemSize;
  return buffer;
};

createTexture = function(ctx, textureUnit) {
  var gl, texture;
  gl = ctx.gl;
  texture = gl.createTexture();
  gl.activeTexture(textureUnit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, ctx.canvas.width, ctx.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  return texture;
};

createContext = function(mode, greyscale, colormap, slider, canvasName) {
  var ctx;
  ctx = new Object();
  ctx.mode = mode;
  ctx.greyscale = greyscale;
  ctx.colormap = colormap;
  ctx.slider = slider;
  ctx.updateShader = true;
  ctx.canvas = document.getElementById(canvasName);
  ctx.canvas.addEventListener("webglcontextlost", (function(event) {
    return event.preventDefault();
  }), false);
  ctx.canvas.addEventListener("webglcontextrestored", glRestoreContext, false);
  ctx.gl = getWebGLContext(ctx.canvas);
  if (ctx.gl) {
    ctx.gl.getExtension("OES_texture_float");
    ctx.vertexBuffer = createBuffer(ctx, vertices);
    ctx.framebuffer = ctx.gl.createFramebuffer();
    ctx.imageTexture = createTexture(ctx, ctx.gl.TEXTURE0);
    return ctx;
  } else {
    return null;
  }
};

drawScene = function(ctx, returnImage) {
  var gl, pColormap, pGreyscaleUniform, pHsvUniform, pNdviUniform, pSampler, pSliderUniform, pVertexPosition;
  if (!returnImage) {
    requestAnimFrame(function() {
      return drawScene(ctx, false);
    });
  }
  if (ctx.updateShader) {
    ctx.updateShader = false;
    generateShader(ctx);
  }
  gl = ctx.gl;
  gl.viewport(0, 0, ctx.canvas.width, ctx.canvas.height);
  gl.useProgram(ctx.shaderProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, ctx.vertexBuffer);
  pVertexPosition = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(pVertexPosition);
  gl.vertexAttribPointer(pVertexPosition, ctx.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
  pSampler = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
  gl.uniform1i(pSampler, 0);
  pSliderUniform = gl.getUniformLocation(ctx.shaderProgram, "uSlider");
  gl.uniform1f(pSliderUniform, ctx.slider);
  pNdviUniform = gl.getUniformLocation(ctx.shaderProgram, "uNdvi");
  gl.uniform1i(pNdviUniform, (ctx.mode === "ndvi" || ctx.colormap ? 1 : 0));
  pGreyscaleUniform = gl.getUniformLocation(ctx.shaderProgram, "uGreyscale");
  gl.uniform1i(pGreyscaleUniform, (ctx.greyscale ? 1 : 0));
  pHsvUniform = gl.getUniformLocation(ctx.shaderProgram, "uHsv");
  gl.uniform1i(pHsvUniform, (ctx.mode === "hsv" ? 1 : 0));
  pColormap = gl.getUniformLocation(ctx.shaderProgram, "uColormap");
  gl.uniform1i(pColormap, (ctx.colormap ? 1 : 0));
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / vertices.itemSize);
  if (returnImage) {
    return ctx.canvas.toDataURL("image/png");
  }
};

generateShader = function(ctx) {
  var b, code, g, r, _ref;
  _ref = modeToEquationMap[ctx.mode], r = _ref[0], g = _ref[1], b = _ref[2];
  r = r.charAt(0) === "#" ? $(r).val() : r;
  g = g.charAt(0) === "#" ? $(g).val() : g;
  b = b.charAt(0) === "#" ? $(b).val() : b;
  r = r.toLowerCase().replace(/h/g, "r").replace(/s/g, "g").replace(/v/g, "b");
  g = g.toLowerCase().replace(/h/g, "r").replace(/s/g, "g").replace(/v/g, "b");
  b = b.toLowerCase().replace(/h/g, "r").replace(/s/g, "g").replace(/v/g, "b");
  r = r.replace(/[^xrgb\/\-\+\*\(\)\.0-9]*/g, "");
  g = g.replace(/[^xrgb\/\-\+\*\(\)\.0-9]*/g, "");
  b = b.replace(/[^xrgb\/\-\+\*\(\)\.0-9]*/g, "");
  r = r.replace(/([0-9])([^\.])?/g, "$1.0$2");
  g = g.replace(/([0-9])([^\.])?/g, "$1.0$2");
  b = b.replace(/([0-9])([^\.])?/g, "$1.0$2");
  if (r === "") {
    r = "r";
  }
  if (g === "") {
    g = "g";
  }
  if (b === "") {
    b = "b";
  }
  code = $("#shader-fs-template").html();
  code = code.replace(/@1@/g, r);
  code = code.replace(/@2@/g, g);
  code = code.replace(/@3@/g, b);
  $("#shader-fs").html(code);
  return ctx.shaderProgram = createProgramFromScripts(ctx.gl, ["shader-vs", "shader-fs"]);
};

glSetMode = function(ctx, newMode) {
  ctx.mode = newMode;
  ctx.updateShader = true;
  $("#download").show();
  if (ctx.mode === "ndvi") {
    $("#colorbar-container")[0].style.display = "inline-block";
    return $("#colormaps-group")[0].style.display = "inline-block";
  } else {
    $("#colorbar-container")[0].style.display = "none";
    return $("#colormaps-group")[0].style.display = "none";
  }
};

glHandleOnLoadTexture = function(ctx, imageData) {
  var gl, texImage;
  gl = ctx.gl;
  texImage = new Image();
  texImage.onload = function(event) {
    gl.activeTexture(gl.TEXTURE0);
    return gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, event.target);
  };
  return texImage.src = imageData;
};

glShaderLoaded = function() {
  waitForShadersToLoad -= 1;
  if (!waitForShadersToLoad) {
    drawScene(imgContext);
    return drawScene(mapContext);
  }
};

glInitInfragram = function() {
  imgContext = createContext("raw", true, false, 1.0, "image");
  mapContext = createContext("raw", true, true, 1.0, "colorbar");
  waitForShadersToLoad = 2;
  $("#shader-vs").load("shader.vert", glShaderLoaded);
  $("#shader-fs-template").load("shader.frag", glShaderLoaded);
  if (imgContext && mapContext) {
    return true;
  } else {
    return false;
  }
};

glRestoreContext = function() {
  var imageData;
  imageData = imgContext.imageData;
  imgContext = createContext(imgContext.mode, imgContext.greyscale, imgContext.colormap, imgContext.slider, "image");
  mapContext = createContext(mapContext.mode, mapContext.greyscale, mapContext.colormap, mapContext.slider, "colorbar");
  if (imgContext && mapContext) {
    return glHandleOnLoadTexture(imgContext, imageData);
  }
};

glHandleOnChangeFile = function(files) {
  var reader;
  if (files && files[0]) {
    reader = new FileReader();
    reader.onload = function(eventObject) {
      imgContext.imageData = eventObject.target.result;
      return glHandleOnLoadTexture(imgContext, eventObject.target.result);
    };
    return reader.readAsDataURL(files[0]);
  }
};

glUpdateImage = function(video) {
  var gl;
  gl = imgContext.gl;
  gl.activeTexture(gl.TEXTURE0);
  return gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
};

glHandleOnClickDownload = function() {
  var event, lnk;
  lnk = document.createElement("a");
  lnk.download = (new Date()).toISOString().replace(/:/g, "_") + ".png";
  lnk.href = drawScene(imgContext, true);
  if (document.createEvent) {
    event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    return lnk.dispatchEvent(event);
  } else if (lnk.fireEvent) {
    return lnk.fireEvent("onclick");
  }
};

glHandleOnClickRaw = function() {
  return glSetMode(imgContext, "raw");
};

glHandleOnClickNdvi = function() {
  return glSetMode(imgContext, "ndvi");
};

glHandleOnSubmitInfraHsv = function() {
  return glSetMode(imgContext, "hsv");
};

glHandleOnSubmitInfra = function() {
  return glSetMode(imgContext, "rgb");
};

glHandleOnSubmitInfraMono = function() {
  return glSetMode(imgContext, "mono");
};

glHandleOnClickGrey = function() {
  return imgContext.greyscale = mapContext.greyscale = true;
};

glHandleOnClickColor = function() {
  return imgContext.greyscale = mapContext.greyscale = false;
};

glHandleOnSlide = function(event) {
  return imgContext.slider = event.value / 100.0;
};

camera = {
  initialize: function() {
    getUserMedia(this.options, this.success, this.deviceError);
    window.webcam = this.options;
    this.canvas = document.getElementById("image");
    this.ctx = this.canvas.getContext("2d");
    $("#webcam-activate").hide();
    $("#snapshot").show();
    $("#live-video").show();
    return $("#webcam").show();
  },
  options: {
    "audio": false,
    "video": true,
    el: "webcam",
    extern: null,
    append: true,
    width: 640,
    height: 480,
    mode: "callback",
    swffile: "fallback/jscam_canvas_only.swf",
    quality: 85,
    debug: function() {},
    onCapture: function() {
      return window.webcam.save();
    },
    onSave: function(data) {
      var col, h, i, img, tmp, w, _i, _ref;
      col = data.split("");
      img = camera.image;
      tmp = null;
      w = this.width;
      h = this.height;
      for (i = _i = 0, _ref = w - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        tmp = parseInt(col[i], 10);
        img.data[camera.pos + 0] = (tmp >> 16) & 0xff;
        img.data[camera.pos + 1] = (tmp >> 8) & 0xff;
        img.data[camera.pos + 2] = tmp & 0xff;
        img.data[camera.pos + 3] = 0xff;
        camera.pos += 4;
      }
      if (camera.pos >= 4 * w * h) {
        camera.ctx.putImageData(img, 0, 0);
        return camera.pos = 0;
      }
    },
    onLoad: function() {}
  },
  success: function(stream) {
    var vendorURL, video;
    if (camera.options.context === "webrtc") {
      video = camera.options.videoEl;
      vendorURL = window.URL || window.webkitURL;
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
        console.log("mozilla???");
      } else if ((typeof MediaStream !== "undefined" && MediaStream !== null) && stream instanceof MediaStream) {
        video.src = stream;
        return video.play();
      } else {
        video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
      }
      return video.onerror = function(e) {
        return stream.stop();
      };
    } else {

    }
  },
  deviceError: function(error) {
    alert("No camera available.");
    console.log(error);
    return console.error("An error occurred: [CODE " + error.code + "]");
  },
  getSnapshot: function() {
    var video;
    if (camera.options.context === "webrtc") {
      video = document.getElementsByTagName("video")[0];
      updateImage(video);
      return $("#webcam").hide();
    } else if (camera.options.context === "flash") {
      return window.webcam.capture();
    } else {
      return alert("No context was supplied to getSnapshot()");
    }
  }
};

webGlSupported = false;

getURLParameter = function(name) {
  var result;
  result = decodeURI((RegExp(name + "=" + "(.+?)(&|$|/)").exec(location.search) || [null, null])[1]);
  if (result === "null") {
    return null;
  } else {
    return result;
  }
};

setParametersFromURL = function(idNameMap) {
  var id, name, val, _results;
  _results = [];
  for (id in idNameMap) {
    name = idNameMap[id];
    val = getURLParameter(name);
    if (val) {
      _results.push($(id).val(val));
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

updateImage = function(video) {
  if (webGlSupported) {
    return glUpdateImage(video);
  } else {
    return jsUpdateImage(video);
  }
};

$(document).ready(function() {
  $("#image-container").ready(function() {
    var enablewebgl, idNameMap;
    idNameMap = {
      "#m_exp": "m",
      "#r_exp": "r",
      "#g_exp": "g",
      "#b_exp": "b",
      "#h_exp": "h",
      "#s_exp": "s",
      "#v_exp": "v"
    };
    setParametersFromURL(idNameMap);
    enablewebgl = getURLParameter("enablewebgl") === "true" ? true : false;
    webGlSupported = enablewebgl && glInitInfragram();
    if (webGlSupported) {
      $("#webgl-activate").html("&laquo; Go back to JS version");
    }
    return true;
  });
  $("#file-sel").change(function() {
    if (webGlSupported) {
      glHandleOnChangeFile(this.files);
    } else {
      jsHandleOnChangeFile(this.files);
    }
    return true;
  });
  $("button#raw").click(function() {
    if (webGlSupported) {
      glHandleOnClickRaw();
    } else {
      jsHandleOnClickRaw();
    }
    return true;
  });
  $("button#ndvi").click(function() {
    if (webGlSupported) {
      glHandleOnClickNdvi();
    } else {
      jsHandleOnClickNdvi();
    }
    return true;
  });
  $("button#nir").click(function() {
    $('#m_exp').val('R');
    $('#modeSwitcher').val('infragrammar_mono').change();
    if (webGlSupported) {
      glHandleOnSubmitInfraMono();
    } else {
      jsHandleOnSubmitInfraMono();
    }
    return true;
  });
  $("#download").click(function() {
    if (webGlSupported) {
      glHandleOnClickDownload();
    } else {
      jsHandleOnClickDownload();
    }
    return true;
  });
  $("#infragrammar_hsv").submit(function() {
    if (webGlSupported) {
      glHandleOnSubmitInfraHsv();
    } else {
      jsHandleOnSubmitInfraHsv();
    }
    return true;
  });
  $("#infragrammar").submit(function() {
    if (webGlSupported) {
      glHandleOnSubmitInfra();
    } else {
      jsHandleOnSubmitInfra();
    }
    return true;
  });
  $("#infragrammar_mono").submit(function() {
    if (webGlSupported) {
      glHandleOnSubmitInfraMono();
    } else {
      jsHandleOnSubmitInfraMono();
    }
    return true;
  });
  $("button#grey").click(function() {
    if (webGlSupported) {
      glHandleOnClickGrey();
    } else {
      jsHandleOnClickGrey();
    }
    return true;
  });
  $("button#colorify").click(function() {
    if (webGlSupported) {
      glHandleOnClickColorify();
    } else {
      jsHandleOnClickColorify();
    }
    return true;
  });
  $("button#color").click(function() {
    if (webGlSupported) {
      glHandleOnClickColor();
    } else {
      jsHandleOnClickColor();
    }
    return true;
  });
  $("#slider").slider().on("slide", function(event) {
    if (webGlSupported) {
      glHandleOnSlide(event);
    } else {
      jsHandleOnSlide(event);
    }
    return true;
  });
  $("#webgl-activate").click(function() {
    var href;
    href = window.location.href;
    if (webGlSupported) {
      href = href.replace(/enablewebgl=true&?/gi, "");
    } else {
      href += href.indexOf("?") >= 0 ? "enablewebgl=true" : "?enablewebgl=true";
    }
    window.location.href = href;
    return true;
  });
  $("#webcam-activate").click(function() {
    camera.initialize();
    return true;
  });
  $("#snapshot").click(function() {
    camera.getSnapshot();
    return true;
  });
  $("#exit-fullscreen").click(function() {
    $("#image").css('display', 'inline');
    $("#image").css('position', 'relative');
    $("#image").css('height', 'auto');
    $('#image').css('left', 0);
    $("#backdrop").hide();
    $("#exit-fullscreen").hide();
    $("#fullscreen").show();
    return true;
  });
  $("#fullscreen").click(function() {
    $("#image").css('display', 'block');
    $("#image").css('height', '100%');
    $("#image").css('width', 'auto');
    $("#image").css('position', 'absolute');
    $("#image").css('top', '0px');
    $("#image").css('left', parseInt((window.innerWidth - $('#image').width()) / 2) + 'px');
    $("#image").css('z-index', '2');
    $("#backdrop").show();
    $("#exit-fullscreen").show();
    $("#fullscreen").hide();
    return true;
  });
  $("#live-video").click(function() {
    if (webGlSupported) {
      setInterval(camera.getSnapshot, 33);
    } else {
      setInterval(camera.getSnapshot, 250);
    }
    return true;
  });
  $("#modeSwitcher").change(function() {
    $('#infragrammar, #infragrammar_mono, #infragrammar_hsv').hide();
    $('#' + $("#modeSwitcher").val()).css('display', 'inline');
    return true;
  });
  return true;
});
