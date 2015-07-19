// Almost all code here is from http://learningwebgl.com/lessons/lesson01/index.html

var sosiskaR = 0.2;

function initWebGL(canvas) {
  gl = null;
  
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  }
  catch(e) {}
  
  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    gl = null;
  }

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
  
  return gl;
}

var GetRenderer = function(canvas, V, E) {
    var ret = {};
    var gl;

    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    var shaderProgram;

    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);


        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
        shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
    }


    var mvMatrix = mat4.create();
    var pMatrix = mat4.create();

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        var normalMatrix = mat3.create();
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }

    var vertexBuffer, normalBuffer;

    function initBuffers(V, kolbaskas) {
        vertexBuffer = gl.createBuffer();
        normalBuffer = gl.createBuffer();
        var vertices = [], normals = [];
        for (var idx in kolbaskas) {
            var sardel = kolbaskas[idx];
            drawSosiska(V[sardel[0]], V[sardel[1]], vertices, normals);
        }
        console.log(vertices);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        vertexBuffer.itemSize = 3;
        vertexBuffer.numItems = vertices.length / 3;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        normalBuffer.itemSize = 3;
        normalBuffer.numItems = normals.length / 3;
    }

    var crossProduct = function(v1, v2) {
        return {'x': v1.y * v2.z - v1.z * v2.y,
                'y': v1.z * v2.x - v1.x * v2.z,
                'z': v1.x * v2.y - v1.y * v2.x}
    }

    var dotProduct = function(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    var norm = function(v1) {
        return Math.sqrt(dotProduct(v1, v1));
    }

    var subtract = function(a, b) {
        return {'x': b.x - a.x, 'y': b.y - a.y, 'z': b.z - a.z};
    }

    var add = function(a, b) {
        return {'x': b.x + a.x, 'y': b.y + a.y, 'z': b.z + a.z};
    }

    var mul = function(a, c) {
        return {'x': a.x * c, 'y': a.y * c, 'z': a.z * c};
    }

    var getRandomVector = function() {
        return {'x': 0.1, 'y': 0.7, 'z': -0.3}; // guaranteed to be random
    }

    var drawSosiska = function(from, to, vertices, normals) {
        var delta = subtract(to, from);
        var normalka1 = (crossProduct(getRandomVector(), delta));
        normalka1 = mul(normalka1, sosiskaR / norm(normalka1));
        var normalka2 = (crossProduct(normalka1, delta));
        normalka2 = mul(normalka2, sosiskaR / norm(normalka2));

        var pushnjak = function(base, norm) {
            var v = add(base, norm);
            vertices.push(v.x);
            vertices.push(v.y);
            vertices.push(v.z);
            normals.push(norm.x);
            normals.push(norm.y);
            normals.push(norm.z);
        }

        var m = 12;
        for (var i = 0; i < m; ++ i) {
            var alpha = i * Math.PI * 2 / m;
            var beta = (i + 1) * Math.PI * 2 / m;
            var da = add(mul(normalka1, Math.sin(alpha)), mul(normalka2, Math.cos(alpha)));
            var db = add(mul(normalka1, Math.sin(beta)), mul(normalka2, Math.cos(beta)));
            pushnjak(from, da), pushnjak(from, db), pushnjak(to, da);
            pushnjak(from, db), pushnjak(to, db), pushnjak(to, da);
        }
    }

    ret.drawScene = function(ang1, ang2) {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        mat4.identity(mvMatrix);

        mat4.translate(mvMatrix, [0.0, 0.0, -7.0]);
        mat4.rotate(mvMatrix, ang2, [0, 1, 0]);
        mat4.rotate(mvMatrix, ang1, [1, 0, 0]);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        var lightingDirection = [
            -1, 1, -1
        ];
        var adjustedLD = vec3.create();
        vec3.normalize(lightingDirection, adjustedLD);
        vec3.scale(adjustedLD, -1);
        gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numItems);
    }

    gl = initWebGL(canvas);

    initShaders();
    initBuffers(V, E);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.DEPTH_TEST);

    return ret;
}
