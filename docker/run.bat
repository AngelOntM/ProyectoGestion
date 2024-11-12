docker system prune -a -f
docker build -t 10a .
del test-report.html
# terminar el run
# docker run -it 10a
docker ps -aql > ids.txt
set /p id= < ids.txt
del ids.txt

docker cp %id%:/10A-Repo/test-report.html .