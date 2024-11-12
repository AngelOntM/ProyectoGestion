docker ps -aql > ids.txt
set /p id= < ids.txt
del ids.txt
echo %id%
