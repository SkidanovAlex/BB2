package battlebrains2.event;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Document {
    private String id;
    private String body;
    private String title;

    public Document() {
    }

    public Document(String id, String body, String title) {
        this.id = id;
        this.body = body;
        this.title = title;
    }

    @XmlElement
    public String getId() {
        return id;
    }

    @XmlElement
    public String getBody() {
        return body;
    }

    @XmlElement
    public String getTitle() {
        return title;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return "Document{" +
                "id=" + id +
                ", body='" + body + '\'' +
                ", title='" + title + '\'' +
                '}';
    }
}
