'use strict'

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    public: { 
        html: 'public/',
        css: 'public/css/',
        img: 'public/img/',
        fonts: 'public/fonts/'
    },

    src: { 
        html: 'src/*.html',
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },

    watch: { //за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};

var config = {
    server: {
        baseDir: "./public"
    },

    notify: false, //отключение уведомлений
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

//Собираем html
gulp.task('html:build', function() {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.public.html))
        .pipe(reload({stream: true}));
});

//Собираем стили
gulp.task('style:build', function() {
    return gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sass().on('error', sass.logError)) //Скомпилируем (щоб помилки відображались в консолі, але gulp при цьому не переставав працювати)
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cleanCSS()) //Сожмем
        .pipe(gulp.dest(path.public.css)) //И в build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

//Собираем картинки
gulp.task('image:build', function() {
    return gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.public.img)) //И в build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

//Шрифты
gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.public.fonts))
});

gulp.task('build', [
    'html:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

//Веб сервер
gulp.task('webserver', function () {
    browserSync(config);
});

//Финальный аккорд
gulp.task('default', ['build', 'webserver', 'watch']);