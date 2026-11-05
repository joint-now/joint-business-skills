#!/usr/bin/env python3
"""Create a versioned plugin ZIP with a stable file order and timestamps."""

import hashlib
import json
from pathlib import Path
import zipfile


repository_root = Path(__file__).resolve().parent.parent
marketplace = json.loads((repository_root / ".claude-plugin/marketplace.json").read_text())
output_directory = repository_root / "dist"
output_directory.mkdir(exist_ok=True)

for entry in marketplace["plugins"]:
    plugin_root = repository_root / entry["source"]
    plugin = json.loads((plugin_root / ".claude-plugin/plugin.json").read_text())
    archive_name = f"{plugin['name']}-{plugin['version']}.zip"
    archive_path = output_directory / archive_name
    contents = {
        path.relative_to(plugin_root).as_posix(): path.read_bytes()
        for path in sorted(plugin_root.rglob("*"))
        if path.is_file()
    }
    contents["LICENSE"] = (repository_root / "LICENSE").read_bytes()
    with zipfile.ZipFile(archive_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for archive_entry, content in sorted(contents.items()):
            file_info = zipfile.ZipInfo(archive_entry, date_time=(1980, 1, 1, 0, 0, 0))
            file_info.compress_type = zipfile.ZIP_DEFLATED
            file_info.create_system = 3
            file_info.external_attr = 0o100644 << 16
            archive.writestr(file_info, content, compresslevel=9)
    checksum = hashlib.sha256(archive_path.read_bytes()).hexdigest()
    (output_directory / f"{archive_name}.sha256").write_text(f"{checksum}  {archive_name}\n")
    print(f"ZIP 생성: dist/{archive_name} ({len(contents)} files)")
    print(f"SHA-256: {checksum}")
