module.exports = function (grunt) {
  grunt.initConfig({
    uncss: {
      dist: {
        files: [{ src: "index.html", dest: "assets/css/styles.css" }],
      },
    },
    cssmin: {
      dist: {
        files: [
          { src: "assets/css/styles.css", dest: "assets/css/styles.css" },
        ],
      },
    },
  });

  // Load the plugins
  grunt.loadNpmTasks("grunt-uncss");
  grunt.loadNpmTasks("grunt-contrib-cssmin");

  // Default tasks
  grunt.registerTask("default", ["uncss", "cssmin"]);
};
