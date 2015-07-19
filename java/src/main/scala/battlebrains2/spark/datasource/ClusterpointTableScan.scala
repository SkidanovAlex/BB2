package battlebrains2.spark.datasource

import org.apache.spark.sql.sources.{BaseRelation, TableScan}
import org.apache.spark.sql.{Row, SQLContext}
import org.apache.spark.sql.types.{StringType, IntegerType, StructField, StructType}
import org.apache.spark.rdd.RDD
import com.clusterpoint.api.CPSConnection
import battlebrains2.config.DatabaseConfiguration
import com.clusterpoint.api.request.CPSSearchRequest
import com.clusterpoint.api.response.CPSSearchResponse
import battlebrains2.utils.ObjectsConverter
import battlebrains2.event.{EvtObject, Document}
import java.util

case class ClusterpointTableScan(partitions: Int)
                                (@transient val sqlContext: SQLContext)
  extends BaseRelation with TableScan {

  val schema: StructType = StructType(Seq(
    StructField("id", StringType, nullable = false),
    StructField("payload", StringType, nullable = false)
  ))

  private def makeRow(e: EvtObject): Row = Row(e.getId, e.getPayload)

  def buildScan: RDD[Row] = {
    val conn = new CPSConnection("tcps://cloud-us-0.clusterpoint.com:9008", DatabaseConfiguration.DBNAME, DatabaseConfiguration.USERNAME, DatabaseConfiguration.PASSWORD, DatabaseConfiguration.ACCOUNT_ID, "document", "//document/id")

    val list = new util.HashMap[String, String]()
    val offset = 0
    val docs = 1000
    val query: String = "<id>evt*</id>"
    val search_req: CPSSearchRequest = new CPSSearchRequest(query, offset, docs, list)
    val search_resp: CPSSearchResponse = conn.sendRequest(search_req).asInstanceOf[CPSSearchResponse]

    import scala.collection.JavaConversions._
    val resultsList = search_resp.getDocuments
    val events = resultsList.map(ObjectsConverter.fromDOM(_, classOf[EvtObject]))
    val rows = events.map(makeRow(_))

    sqlContext.sparkContext.parallelize(rows, partitions)
  }
}
