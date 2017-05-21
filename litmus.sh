#!/bin/bash

export MAILFROM="appname@servername.com"
export MAILBCC=""
export SUBJECT="Test Creativity"
#export BODY="testEmail.html"
#export ATTACH="file.pdf"
#export MAILPART=`uuidgen` ## Generates Unique ID
export MAILPART_BODY=`uuidgen` ## Generates Unique ID
export MAIL_CREATION_DATE=`date '+%Y%m%d_%H%M%S'`

(
 echo "From: $MAILFROM"
 echo "To: $1"
 echo "CC: $3"
 echo "BCC: $MAILBCC"
 echo "MIME-Version: 1.0"
 echo "Content-Type: multipart/alternative;"
 echo "  boundary=\"$MAILPART_BODY\""
 echo "Subject: $SUBJECT"
 echo "MyField: $3"
 echo ""
 echo "This is a multi-part message in MIME format"
 echo ""
 echo "--$MAILPART_BODY"
 echo "Content-Type: text/plain; charset=\"utf-8\"; format=\"fixed\""
 echo "Content-Transfer-Encoding: quoted-printable"
 echo ""
 echo "You need to enable HTML option for email"
 echo ""
 echo "--$MAILPART_BODY"
 echo "Content-Type: text/html; charset=\"utf-8\""
 echo ""
 echo $2
 echo "--$MAILPART_BODY--"
) > email_$MAIL_CREATION_DATE.out

cat email_$MAIL_CREATION_DATE.out | /usr/sbin/sendmail -t
