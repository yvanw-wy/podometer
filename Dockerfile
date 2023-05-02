FROM ubuntu:latest
# Install cron and all the basic librairies
RUN apt-get update && apt-get -y install cron && apt-get -y install pip
# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# Correct Redis warning
RUN sysctl "vm.overcommit_memory=1"

WORKDIR /usr/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /usr/app/requirements.txt
RUN pip install -r requirements.txt

# Run the command on container startup
CMD cron && tail -f /var/log/cron.log