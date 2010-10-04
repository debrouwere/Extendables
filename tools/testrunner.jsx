var root = new File($.fileName).parent.parent;

// Executes these subrunners entirely separate so they can't influence each other.
// That means $.evalFile instead of #include
$.evalFile(root.absoluteURI + "/test/runner.patches.jsx");
$.evalFile(root.absoluteURI + "/test/runner.framework.jsx");
$.evalFile(root.absoluteURI + "/test/runner.packages.jsx");
$.writeln("Finished test run.");