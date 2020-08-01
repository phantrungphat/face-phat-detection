FROM python:3.7-rc
MAINTAINER 16520916@gm.uit.edu.vn

# clone project face detection
RUN git clone -q https://github.com/phantrungphat/face-phat-detection.git

# check our python environment
RUN python --version
RUN pip3 --version

# set the working directory for containers
WORKDIR  ./face-phat-detection

RUN pip3 install --upgrade cython
#install packets requirements
RUN pip3 install -r requirements.txt
RUN pip3 install scikit-learn
RUN apt-get update && \
	apt-get install -y python3-opencv

# Running Python Application
CMD ["python", "model_camera.py"]