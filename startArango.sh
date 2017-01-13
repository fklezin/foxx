#/bin/bash
sudo /usr/sbin/arangod --uid arangodb --gid arangodb --pid-file /var/run/arangodb/arangod.pid --temp.path "/var/tmp/arangod" --log.foreground-tty true