package battlebrains2.spark.datasource

import org.apache.spark.sql.sources.RelationProvider
import org.apache.spark.sql.SQLContext


class CustomRP extends RelationProvider {

  def createRelation(sqlContext: SQLContext, parameters: Map[String, String]) = {
    ClusterpointTableScan(parameters("partitions").toInt)(sqlContext)
  }

}
