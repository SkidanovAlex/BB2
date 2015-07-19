package battlebrains2.spark.datasource

import org.apache.spark.{SparkContext, SparkConf}
import org.apache.spark.sql.SQLContext

object SparkApp {
  def main(args: Array[String]) {
    val conf = new SparkConf().setAppName("Spark+ClusterPoint")
    val spark = new SparkContext(conf)
    val sqlContext = new SQLContext(spark)
    sqlContext.sql(
      s"""
        |CREATE TEMPORARY TABLE dataTable
        |USING battlebrains2.spark.datasource.CustomRP
        |OPTIONS (partitions '9')
      """.stripMargin)
    val data = sqlContext.sql("SELECT * FROM dataTable ORDER BY id")
    data.show()

    spark.stop()
  }
}
