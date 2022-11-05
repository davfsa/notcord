workdir=${PWD##*/}
if [ "$workdir" != "notcord" ]; then
  echo "Commands must be run from the repository root"
  exit 1
fi

pushd services || exit 1
pushd notcord-rest-server || exit 1

if [[ ! "${NC_WORKER_ID}" =~ ^[0-9]+$ ]]; then
  echo "NC_WORKER_ID not set or invalid. Defaulting to 0"
  export NC_WORKER_ID=0
fi
if [[ ! "${NC_PROCESS_ID}" =~ ^[0-9]+$ ]]; then
  echo "NC_PROCESS_ID not set or invalid. Defaulting to 0"
  export NC_PROCESS_ID=0
fi

../mvnw clean package spring-boot:run
