/**
 * Created by Administrator on 2016/10/31 0031.
 */

//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin'),
    ngHtml2js = require('gulp-ng-html2js'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    ngAnnotate = require('gulp-ng-annotate'),
	cssmin = require('gulp-clean-css'),
    uglify = require('gulp-uglify');



//定义一任个test务（自定义任务名称）
gulp.task('Concat', function () {
    return gulp.src(['src/app/**/*.js','src/app/**/**/*.js'])
            .pipe(ngAnnotate())
            .pipe(uglify())          //编译并压缩js
            .pipe(concat('app.js')) //合并后的文件名
            .pipe(gulp.dest('dist/js'));
});

gulp.task('build-html', function () {
    return gulp.src(['src/app/**/views/*.html'])
        .pipe(htmlmin())
        .pipe(ngHtml2js({
            moduleName: 'App'
        }))
        .pipe(concat('template.tpl.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('testImagemin', function () {
    gulp.src('src/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('sass',function(){
    return gulp.src('src/styles/sass/*.scss')
            .pipe(sass())    //编译 css
            .pipe(cssmin())  // 压缩css
            .pipe(gulp.dest('dist/styles/css'))  //压缩完放到该目录下
});

/**
 * 复制index.html
 */
gulp.task('indexhtml',function(){
    return gulp.src('src/index.html')
            .pipe(concat('index.html'))
            .pipe(gulp.dest('dist'))
});

gulp.task('server',function(){
    browserSync.init({
        // server: "./dist",
        proxy:"http://tianm.test.com",
        port:3017,
        ui:{
			port:3018
        }
    });
    gulp.watch('src/index.html',[
        'indexhtml',browserSync.reload
    ]);
    gulp.watch(['src/app/**/*.*','src/app/**/**/*.*'],[
        'Concat','build-html',browserSync.reload
    ]);
	gulp.watch('src/styles/sass/*',[
		'sass',browserSync.reload
	]);

});

gulp.task('default',['Concat','build-html']); //定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务
/*gulp.task('auto', function () {
// 监听文件修改，当文件被修改则执行 images 任务
    gulp.watch('dist/assets/images/!*.*)', ['images'])
});*/
// gulp.task('vendor',function(){
// 	gulp.src('src/styles/js/*.js')
// 	.pipe(concat('vendor.js'))
// 	.pipe(gulp.dest('dist/js'));
// });
