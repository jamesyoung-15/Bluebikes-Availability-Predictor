from werkzeug.middleware.proxy_fix import ProxyFix
from app import app as application

app = application

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
)

if __name__ == "__main__":
    app.run()
