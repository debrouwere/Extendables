var root = new Folder("test").at(Folder.extendables).absoluteURI;

// Executes these subrunners entirely separate so they can't influence each other.
// That means $.evalFile instead of #include
$.evalFile(root + "/runner.patches.jsx");
$.evalFile(root + "/runner.framework.jsx");
$.evalFile(root + "/runner.packages.jsx");
$.writeln("Finished test run.");