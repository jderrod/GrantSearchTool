import os
import shutil
import subprocess
from pathlib import Path

def build_project():
    # Create dist directory
    dist_dir = Path("dist")
    dist_dir.mkdir(exist_ok=True)
    
    # Build Frontend
    print("Building Frontend...")
    subprocess.run(["npm", "run", "build"], cwd="frontend")
    
    # Build Backend
    print("Building Backend...")
    subprocess.run([
        "pyinstaller",
        "--onefile",
        "--add-data", "grants.db:.",
        "--add-data", "grants_data.db:.",
        "--add-data", "frontend/build:frontend/build",
        "api.py"
    ])
    
    # Copy necessary files
    build_files = [
        "requirements.txt",
        "README.md",
        "grants.db",
        "grants_data.db"
    ]
    
    for file in build_files:
        if os.path.exists(file):
            shutil.copy2(file, dist_dir)
    
    print("Build complete! Check the dist directory.")

if __name__ == "__main__":
    build_project()