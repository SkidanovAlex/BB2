#!/bin/bash
set -e
SPARK="root@45.79.75.222"
FATJAR="java"
CLASSNAME="battlebrains2.spark.datasource.SparkApp"
scp build/libs/$FATJAR.jar $SPARK:
ssh $SPARK -t "/root/spark-1.4.1-bin-hadoop2.6/bin/spark-submit --class $CLASSNAME $FATJAR.jar"
