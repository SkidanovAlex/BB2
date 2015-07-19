import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

import db
from spemail import sendEmail
import requests

class TopLevelHandler(tornado.web.RequestHandler):
    def get(self):
        self.redirect('index.html')

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('game.html')

class EmailGameHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('email.html')
        sendEmail()

class SendHandler(tornado.web.RequestHandler):
    def get(self, pid, evt, g):
        pid = int(pid)
        db.add_event(pid, evt)
        self.finish('1')

class ChatMessageHandler(tornado.web.RequestHandler):
    def get(self, msg, g):
        db.chat_message(msg)
        self.finish('1')

class ChatRecognizeHandler(tornado.web.RequestHandler):
    def post(self):
        r = requests.post('', data=self.request.body)
        db.chat_message2(r.text)
        self.finish('1')

class UpdateHandler(tornado.web.RequestHandler):
    def get(self, pid, lid, g):
        pid = int(pid)
        lid = int(lid)
        strs = []
        newLid = lid
        for row in db.get_events_past(pid, lid):
            strs.append("if (%s > lid) opponentEvent(%s);" % (row['event_id'], row['evt']))
            newLid = row['event_id']
        strs.append('lid = %s;' % newLid)
        self.finish('\n'.join(strs))

class FightHandler(tornado.web.RequestHandler):
    def get(self, pid, g):
        pid = int(pid)
        opp_id = db.get_opponent(pid)
        if opp_id is not None:
            self.finish("startGame('%s');" % opp_id)
        else:
            req_id = db.get_request()
            if req_id is not None and req_id != pid:
                db.kill_events([pid, req_id])
                db.set_opponents(pid, req_id)
                self.finish("startGame('%s');" % req_id)
                db.set_request(None)
            else:
                db.set_request(pid)
                self.finish('waitForOpp()')


tornado.options.parse_command_line()
application = tornado.web.Application([
    (r'/', TopLevelHandler),
    (r'/game', MainHandler),
    (r'/email', EmailGameHandler),
    (r'/send/([0-9]+)/([^/]+)/([0-9]+)', SendHandler),
    (r'/chatmsg/([^/]+)/([0-9]+)', ChatMessageHandler),
    (r'/chat_recognize', ChatRecognizeHandler),
    (r'/update/([0-9]+)/([0-9]+)/([0-9]+)', UpdateHandler),
    (r'/fight/([0-9]+)/([0-9]+)', FightHandler),
    (r'/images/(.*)', tornado.web.StaticFileHandler, {'path': 'images/'}),
    (r'/js/(.*)', tornado.web.StaticFileHandler, {'path': 'js/'}),
    (r'/css/(.*)', tornado.web.StaticFileHandler, {'path': 'css/'}),
    (r'/fonts/(.*)', tornado.web.StaticFileHandler, {'path': 'fonts/'}),
    (r'/(.*\.html)', tornado.web.StaticFileHandler, {'path': 'html/'}),
])

if __name__ == '__main__':
    print "Started"
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(80)
    tornado.ioloop.IOLoop.instance().start()

