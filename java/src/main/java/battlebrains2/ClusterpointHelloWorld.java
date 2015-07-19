package battlebrains2;

import battlebrains2.config.DatabaseConfiguration;
import battlebrains2.event.EvtObject;
import battlebrains2.utils.ObjectsConverter;
import com.clusterpoint.api.CPSConnection;
import com.clusterpoint.api.CPSResponse;
import com.clusterpoint.api.request.CPSInsertRequest;
import com.clusterpoint.api.request.CPSLookupRequest;
import com.clusterpoint.api.request.CPSRetrieveRequest;
import com.clusterpoint.api.request.CPSSearchRequest;
import com.clusterpoint.api.response.CPSListLastRetrieveFirstResponse;
import com.clusterpoint.api.response.CPSLookupResponse;
import com.clusterpoint.api.response.CPSSearchResponse;
import org.w3c.dom.Element;

import java.io.IOException;
import java.util.*;

public class ClusterpointHelloWorld {

    public static void main(String[] args) {
        CPSConnection conn = null;
        try {
            conn = new CPSConnection("tcps://cloud-us-0.clusterpoint.com:9008", DatabaseConfiguration.DBNAME, DatabaseConfiguration.USERNAME, DatabaseConfiguration.PASSWORD, DatabaseConfiguration.ACCOUNT_ID, "document", "//document/id");
            insert(conn);
            search(conn);
            lookup(conn);
            retrieve(conn);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    static void insert(CPSConnection conn) {
        List<String> docs = new ArrayList<String>();
        docs.add("<document><id>id1</id><title>Test document 1</title><body>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a nisl magna</body></document>");
        docs.add("<document><id>id2</id><title>Test document 2</title><body>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a nisl magna</body></document>");
        docs.add("<document><id>id3</id><title>Test document 3</title><body>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a nisl magna</body></document>");
        docs.add("<document><id>id4</id><title>Test document 4</title><body>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a nisl magna</body></document>");

        //Create Insert request
        CPSInsertRequest insert_req = new CPSInsertRequest();
        //Add documents to request
        insert_req.setStringDocuments(docs);
        //Send request
        try {
            CPSResponse insert_resp = conn.sendRequest(insert_req);
            System.out.println(insert_resp);
        } catch (Exception ignored) {
            ignored.printStackTrace();
        }
    }

    static void search(CPSConnection conn) throws Exception {
        // Setting parameters
        String query = "evt*";

        // return documents starting with the first one - offset 0
        int offset = 0;
        // return not more than 5 documents
        int docs = 5;
        // return these fields from the documents
        Map<String, String> list = new HashMap<String, String>();

        CPSSearchRequest search_req = new CPSSearchRequest(query, offset, docs, list);
        CPSSearchResponse search_resp = (CPSSearchResponse) conn.sendRequest(search_req);

        if (search_resp.getHits() > 0) {
            System.out.println("Found:" + search_resp.getHits());
            //get list of found documents as DOM Element
            List<Element> results = search_resp.getDocuments();
            for (Element el : results) {
                System.out.println(ObjectsConverter.fromDOM(el, EvtObject.class));
            }
        }
    }

    static void lookup(CPSConnection conn) throws Exception {
        //Set two ids to lookup
        String ids[] = {"id1", "id4"};
        //Return just document id and title in found documents
        Map<String, String> list = new HashMap<String, String>();
//        list.put("document/id", "yes");
//        list.put("document/title", "yes");

        CPSLookupRequest req = new CPSLookupRequest(ids, list);
        CPSLookupResponse resp = (CPSLookupResponse) conn.sendRequest(req);

        System.out.println("Found " + resp.getFound());

        List<Element> docs = resp.getDocuments();
        Iterator<Element> it = docs.iterator();
        //Iterate through found documents
        while (it.hasNext()) {
            Element el = it.next();
            System.out.println(ObjectsConverter.printDocument(el));
            //Here goes code that extracts data from DOM Element
        }
    }

    static void retrieve(CPSConnection conn) throws Exception {
        //Set two ids to lookup
        //Return just document id and title in found documents
        Map<String, String> list = new HashMap<String, String>();
//        list.put("document/id", "yes");
//        list.put("document/title", "yes");

        CPSRetrieveRequest retr_req = new CPSRetrieveRequest(new String[]{"id1", "id2"});
        CPSListLastRetrieveFirstResponse retr_resp = (CPSListLastRetrieveFirstResponse) conn.sendRequest(retr_req);

        List<Element> docs = retr_resp.getDocuments();
        Iterator<Element> it = docs.iterator();
        while (it.hasNext()) {
            Element el = it.next();
            System.out.println(ObjectsConverter.printDocument(el));
            //here goes the code extracting data from DOM Element
        }
    }
}
