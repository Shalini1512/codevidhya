#!/system/bin/sh

# for studentdir in Codeplay/*/*
#  do
#    mkdir $studentdir/my_files
# done

for studentdir in ../../../Codeplay/*/*
  do
    mkdir $studentdir/my_files
    find $studentdir -maxdepth 1 -type f -exec mv {} $studentdir/my_files \;
done
