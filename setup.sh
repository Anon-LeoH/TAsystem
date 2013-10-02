#!/bin/bash -e

# Script to install packages necessary for setup.
# Pasted from Google Chromium: src/build/install-build-deps.sh

# Packages need for setup
packages="nodejs mongodb npm"
install_cmd="sudo apt-get install --reinstall $(echo $packages)"

if new_list="$(yes n | LANGUAGE=en LANG=C $install_cmd)"; then
  # We probably never hit this following line.
  echo "No missing packages, and the packages are up-to-date."
elif [ $? -eq 1 ]; then
  # We expect apt-get to have exit status of 1.
  # This indicates that we cancelled the install with "yes n|".
  new_list=$(echo "$new_list" |
    sed -e '1,/The following NEW packages will be installed:/d;s/^  //;t;d')
  new_list=$(echo "$new_list" | sed 's/ *$//')
  if [ -z "$new_list" ] ; then
    echo "No missing packages, and the packages are up-to-date."
  else
    echo "Installing missing packages: $new_list."
    sudo apt-get install ${new_list}
  fi
  echo
else
  # An apt-get exit status of 100 indicates that a real error has occurred.

  # I am intentionally leaving out the '"'s around install_cmd,
  # as this makes it easier to cut and paste the output
  echo "The following command failed: " ${install_cmd}
  echo
  echo "It produces the following output:"
  yes n | $install_cmd || true
  echo
  echo "You will have to install the above packages yourself."
  echo
  exit 100
fi

# Install nodejs mongodb library.
sudo npm install mongodb 
