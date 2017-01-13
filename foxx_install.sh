#!/bin/bash
#
# namesti foxx app
#
# ./foxx_install.sh <flag>
#

HELP="./foxx_install.sh <flag> <database='converted'>    (flag: -i = install, -u = update; )"

DATABASE="pheidippides"
LOCAL_PASS="root"
DEVELOPMENT=0

##
# get install or update params
INSTALL=1
if [[ -n $1 ]]; then
    if [[ $1 == "-i" ]]; then
        INSTALL=1
    elif [[ $1 == "-u" ]]; then
        INSTALL=0
    else
        echo $HELP
        exit
    fi
fi
if [[ $# -lt 1 ]]; then
    echo $HELP
    exit
fi

if [[ -n $2 ]]; then
    DATABASE=$2
fi

##
# prepare foxx-manager params
foxxManagerPassParam=""
if [[ $DEVELOPMENT -eq 1 ]]; then
    foxxManagerPassParam="--server.password "$LOCAL_PASS
fi

foxxManagerActionParam="upgrade"
if [[ INSTALL -eq 1 ]]; then
    foxxManagerActionParam="install"
fi


##
# install / upgrade /ibe webservice
foxx-manager --server.authentication true --server.database=$DATABASE $foxxManagerPassParam $foxxManagerActionParam "phe" "/phe"
if [[ $DEVELOPMENT -eq 1 ]]; then
    foxx-manager --server.authentication true --server.database=$DATABASE $foxxManagerPassParam development "/phe"
fi
