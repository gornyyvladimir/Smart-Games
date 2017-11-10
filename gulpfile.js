"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var pump = require('pump');
var babel = require('gulp-babel');
var rename = require("gulp-rename");

gulp.task("compress", function(cb) {
    pump([
            gulp.src('js/script.min.js'),
            uglify(),
            gulp.dest('js')
        ],
        cb
    );
});

gulp.task("babel", function() {
    gulp.src('js/script.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(rename("script.min.js"))
        .pipe(gulp.dest('js'))
});

gulp.task("style", function() {
    gulp.src("less/style.less")
        .pipe(plumber())
        .pipe(less())
        .pipe(postcss([
            autoprefixer()
        ]))
        // .pipe(csso())
        .pipe(gulp.dest("css"))
        .pipe(server.stream());
});

gulp.task("build", ["style", "babel"], function() {});

gulp.task("serve", ["style"], function() {
    server.init({
        server: ".",
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch("less/**/*.less", ["style"]);
    gulp.watch("*.html").on("change", server.reload);
});