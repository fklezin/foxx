#!/bin/bash
#
# namesti foxx app
#
# ./foxx_install.sh <flag>
#

HELP="./foxx_install.sh <flag>     (flag: -i = install, -u = update)"
DATABASE="pheidippides"
DEVELOPMENT=1

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
if [[ $# -gt 1 ]]; then
    echo $HELP
    exit
fi

##
# prepare foxx-manager params
foxxManagerAuthParam="true"
if [[ $DEVELOPMENT -eq 1 ]]; then
    foxxManagerAuthParam="false"
fi

foxxManagerActionParam="upgrade"
if [[ INSTALL -eq 1 ]]; then
    foxxManagerActionParam="install"
fi


##
# install / upgrade /ibe webservice
foxx-manager --server.authentication $foxxManagerAuthParam --server.database=$DATABASE $foxxManagerActionParam "phe" "/phe"
if [[ $DEVELOPMENT -eq 1 ]]; then
    foxx-manager --server.authentication $foxxManagerAuthParam --server.database=$DATABASE development "/phe"
fi
