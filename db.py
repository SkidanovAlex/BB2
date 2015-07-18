events = []
opponents = {}
last_event_id = 0
request_id = None

def add_event(pid, evt):
    global events
    global last_event_id
    last_event_id += 1
    events.append({'event_id': last_event_id, 'user_id': pid, 'evt': evt})

def get_events_past(pid, lid):
    global events
    for event in events:
        if event['user_id'] == pid and event['event_id'] > lid:
            yield event

def kill_events(pids):
    global events
    new_events = []
    for event in events:
        if event['user_id'] not in pids:
            new_events.append(event)
    events = new_events

def set_opponents(p1, p2):
    global opponents
    opponents[p1] = p2
    opponents[p2] = p1

def get_opponent(pid):
    global opponents
    if pid in opponents:
        return opponents[pid]
    return None

def set_request(pid):
    global request_id
    assert pid is None or request_id is None or request_id == pid
    request_id = pid

def get_request():
    global request_id
    return request_id

