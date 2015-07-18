import pycps

con = pycps.Connection('tcp://cloud-us-0.clusterpoint.com:9007', 'db', 'mikhail.kever@gmail.com', 'angelhack', '100864')

events = []
last_event_id = 0

def insert(key, value):
    con.insert({key: {'payload': value}})

def delete(key):
    try:
        con.delete(key)
    except pycps.APIError as e:
        print "delete %s: %s" % (key, e)

def select(key): 
    try:
        response = con.retrieve(key)
        for _,d in response.get_documents().items():
            print repr(d)
            return d['payload']
    except pycps.APIError as e:
        print("select %s: %s" % (key, e))
        if e.code == 2824:
            return None
        raise

def add_event(pid, evt):
    global last_event_id
    last_event_id += 1
    insert('evt_%s_%s' % (pid, last_event_id), evt)

def get_events_past(pid, lid):
    try:
        response = con.search('evt_%s_*' % pid)
        for k, d in response.get_documents().items():
            evt_id = int(k.split('_')[2])
            if evt_id > lid:
                yield {'event_id': evt_id, 'evt': d['payload']}
    except TypeError:
        print "Not quite"
    except:
        raise

def kill_events(pids):
    global events
    new_events = []
    for event in events:
        if event['user_id'] not in pids:
            new_events.append(event)
    events = new_events

def set_opponents(p1, p2):
    delete('opp_%s' % p1)
    delete('opp_%s' % p2)
    insert('opp_%s' % p1, str(p2))
    insert('opp_%s' % p2, str(p1))

def get_opponent(pid):
    ret = select('opp_%s' % pid)
    if ret is not None: ret = int(ret)
    return ret

def set_request(pid):
    if pid is None:
        delete('request')
        return
    current_request = select('request')
    if current_request is not None:
        current_request = int(current_request)
    assert current_request == pid or current_request is None, "%s != %s" % (current_request, pid)
    if current_request != pid:
        insert('request', str(pid))

def get_request():
    pid = select('request')
    if pid is not None:
        pid = int(pid)
    return pid

delete('request')
