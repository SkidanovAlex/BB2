package battlebrains2.event;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class EvtObject {
    private String id;
    private String payload;

    public String getId() {
        return id;
    }

    @XmlElement
    public void setId(String id) {
        this.id = id;
    }

    public String getPayload() {
        return payload;
    }

    @XmlElement
    public void setPayload(String payload) {
        this.payload = payload;
    }
}
