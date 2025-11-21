from flask import Flask, request, jsonify, send_from_directory
import os
from services.extract_service import extract_marksheet
import logging
import os
from flask_cors import CORS  


app = Flask(__name__)
# Production frontend URL - no environment variables needed
frontend_url = "https://studenttracker-xi.vercel.app"
CORS(app, origins=[frontend_url, "http://localhost:5173"])  # Allow both production and local development

# enable CORS if the package is available so the frontend (served from Live Server / Vite) can call this API
if CORS is not None:
    CORS(app)
else:
    app.logger.warning('flask_cors is not installed; requests from other origins may be blocked by the browser (CORS).')

# Serve the simple frontend from the sibling `Frontend` folder so the app and frontend share the same origin
# This avoids CORS issues when users open the app in a browser. The static folder path is relative to this file's directory.
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Frontend', 'dist')
app = Flask(__name__, static_folder=frontend_path, static_url_path='')

# enable CORS if available (re-check after creating app)
if CORS is not None:
    CORS(app)
else:
    app.logger.warning('flask_cors is not installed; serving frontend from the same origin will avoid CORS problems.')
logging.basicConfig(level=logging.INFO)



@app.route("/api/marksheet/upload", methods=["POST"])
def upload_marksheet():
    try:
        file = request.files["file"]
        app.logger.info(f"📄 Uploaded file: {file.filename}")

        result = extract_marksheet(file)
        
        # No database storage - purely processing
        
        return jsonify(result), 200
    except Exception as e:
        app.logger.error(f"❌ Upload failed: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Serve files from the Frontend folder. If a file isn't found, return index.html."""
    if path != '' and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return app.send_static_file('index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
