#!/system/bin/sh

for studentdir in ../../../Codeplay/*
  do
    find $studentdir/* -maxdepth 1 -type d \! -exec test -e '{}/index.html' \; -exec cp ../../misc/default_project_files/default_web_project.html {}/index.html \;
    find $studentdir/* -maxdepth 1 -type d \! -exec test -e '{}/main.py' \; -exec cp ../../misc/default_project_files/default_python_project.py {}/main.py \;
done
