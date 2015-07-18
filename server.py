import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

import db

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('game.html')

class SendHandler(tornado.web.RequestHandler):
    def get(self, pid, evt, g):
        pid = int(pid)
        db.add_event(pid, evt)
        self.finish('1')

class UpdateHandler(tornado.web.RequestHandler):
    def get(self, pid, lid, g):
        pid = int(pid)
        lid = int(lid)
        strs = []
        newLid = lid
        for row in db.get_events_past(pid, lid):
            strs.append("opponentEvent(%s);" % row['evt'])
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
    (r'/', MainHandler),
    (r'/send/([0-9]+)/([^/]+)/([0-9]+)', SendHandler),
    (r'/update/([0-9]+)/([0-9]+)/([0-9]+)', UpdateHandler),
    (r'/fight/([0-9]+)/([0-9]+)', FightHandler),
    (r'/images/(.*)', tornado.web.StaticFileHandler, {'path': 'images/'}),
    (r'/js/(.*)', tornado.web.StaticFileHandler, {'path': 'js/'}),
])

if __name__ == '__main__':
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(8001)
    tornado.ioloop.IOLoop.instance().start()

