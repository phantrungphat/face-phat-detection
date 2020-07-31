FROM python:3.6
MAINTAINER 16520916@gm.uit.edu.vn

# clone project face detection
RUN git clone -q https://github.com/phantrungphat/face-phat-detection.git

# check our python environment
RUN python --version
RUN pip --version

#install packets requirements
RUN pip install -r requirements.txt

# set the working directory for containers
WORKDIR  face-phat-detection

# Running Python Application
CMD ["python", "model_camera.py"]