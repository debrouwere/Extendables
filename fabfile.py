import os
from fabric.api import *
from fabric.context_managers import cd

PACKAGEFOLDERS = ['./core-packages']
OTHER_FOLDERS = ['./', './patches']
JSDOC = "java -jar /Applications/jsdoc-toolkit/jsrun.jar /Applications/jsdoc-toolkit/app/run.js"

class Folder(str):
    pass

def _document_this():
    folders = OTHER_FOLDERS
    for packagefolder in PACKAGEFOLDERS:
        for folder in os.listdir(packagefolder):
            if not folder.startswith("."):
                folder = Folder(packagefolder + "/" + folder)
                folder.package = "/lib"
                folders.append(folder)
    return folders

def build_jsdoc():
    for folder in _document_this():
        local("{0} {1}{2} --template=doc/_themes/rst -x=js,jsx --directory={1}/doc/jsdoc".format(JSDOC, folder, getattr(folder, 'package', '')))

def build_sphinx():
    with cd("doc"):
        local("make html")

def docbuild(part='all'):
    # jsdoc should be aliased to something like 
    # java -jar jsdoc-toolkit/jsrun.jar jsdoc-toolkit/app/run.js
    
    if part == 'js':
        build_jsdoc()
    elif part == 'project':
        build_sphinx()
    elif part == 'clean':
        with cd("doc"):
            local("make clean")
        build_jsdoc()
        build_sphinx()        
    else:
        build_jsdoc()
        build_sphinx()