var gulp = require('gulp'),
    less = require('gulp-less'),                   //less 转 css
    csso = require('gulp-csso'),                   //css压缩
    // concat = require('gulp-concat'),               //合并文件
    uglify = require('gulp-uglify'),               //js 压缩
    // jshint = require('gulp-jshint'),               //js 检查
    clean = require('gulp-clean'),                 //清除文件
    // imagemin = require('gulp-imagemin'),           //图片压缩
    // rev = require('gulp-rev'),                     //添加版本号
    // revReplace = require('gulp-rev-replace'),      //版本号替换
    // useref = require('gulp-useref'),               //解析html资源定位
    // gulpif = require('gulp-if'),                   //if语句
    autoprefixer  = require('gulp-autoprefixer'),
    connect = require('gulp-connect');             //创建web服务器

//图片压缩
gulp.task('dist:img', function() {
    return gulp.src('./src/images/*.{png,jpg,gif,ico}')
    // .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
})

//less转css压缩合并
gulp.task('dist:css', function(){
    gulp.src('dist/css/*.css').pipe(clean());
    return gulp.src('./src/less/*.less')
    .pipe(less())
    .pipe(csso())
    // .pipe(concat('public.css'))
    .pipe(gulp.dest('dist/css/'));
});

//less转css
gulp.task('src:css', () => {
    gulp.src('src/css/*.css').pipe(clean());
    console.log('监听less')
    return gulp.src('./src/less/*.less')
    // .pipe(autoprefixer(['last 15 versions']))
    .pipe(less())
    .pipe(gulp.dest('src/css/'));
});

//js压缩合并
gulp.task('dist:js', () => {
    gulp.src('dist/js/*.js').pipe(clean());
    return gulp.src('./src/js/*.js')
    // .pipe(jshint())
    // .pipe(jshint.reporter('default'))
    .pipe(uglify())
    // .pipe(concat('public.js'))
    .pipe(gulp.dest('dist/js/'))
});

//libs拷贝
gulp.task('dist:libs', () => {
    gulp.src('dist/libs/*').pipe(clean());
    return gulp.src('./src/libs/**/*')
    .pipe(gulp.dest('dist/libs/'))
});


//html
gulp.task('dist:html', function(){
    gulp.src('dist/*.html').pipe(clean());
    return gulp.src('./src/*.html').pipe(gulp.dest('dist'))
});

//添加版本号
// gulp.task('revision', ['dist:css', 'dist:js'], () => {
//     return gulp.src(["dist/css/*.css", "dist/js/*.js"])
//     .pipe(rev())
//     .pipe(gulpif('*.css', gulp.dest('dist/css'), gulp.dest('dist/js')))
//     .pipe(rev.manifest())
//     .pipe(gulp.dest('dist'))
// })

//替换html
// gulp.task('build', ['dist:img'], () => {
//     var manifest = gulp.src('dist/rev-manifest.json');
//     return gulp.src('src/index.html')
//     .pipe(revReplace({
//         manifest: manifest
//     }))
//     .pipe(useref())
//     .pipe(gulp.dest('dist/'))
// })
// 
gulp.task('build', ['dist:img','dist:js','dist:libs','dist:css','dist:html'],  function() {
    console.log('完成了')

});

//创建本地服务器
gulp.task('connect', () => {
    connect.server({
        root: 'src',
        livereload: true,
        port: 8888
    })
})

//设置自动刷新
gulp.task('reload', () => {
    gulp.src('src/*.html')
    .pipe(connect.reload())
})

//监听src变化
gulp.task('watch', () => {
    gulp.watch('src/**/*', ['src:css', 'reload'])
})

//清除
gulp.task('clean', () => {
    gulp.src('dist/*', {read: false})
    .pipe(clean())
})

gulp.task('default', ['connect','watch']);