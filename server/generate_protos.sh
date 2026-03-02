#!/bin/bash
# Manually generate protobuf files to workaround maven plugin issues with spaces in paths
# Supports macOS (Intel & Apple Silicon) and Linux

set -e

# Absolute path to the server directory (where this script lives)
SERVER_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

PROJECT_ROOT="$(dirname "$SERVER_DIR")"
PROTO_ROOT="$PROJECT_ROOT/proto"
=======
PROTO_SRC_DIR="$SERVER_DIR/../proto"
# Use a local directory to bypass permission issues with target_dist
TARGET_BASE="${PROTO_DEST_DIR:-$SERVER_DIR/target_dist}"
GEN_SRC_DIR="$TARGET_BASE/generated-sources/protobuf/java"


# Detect OS and architecture
UNAME_S="$(uname -s)"
UNAME_M="$(uname -m)"

PROTOC_VERSION="3.25.1"

# Determine OS
case "$UNAME_S" in
  Darwin)
    PROTOC_OS="osx"
    ;;
  Linux)
    PROTOC_OS="linux"
    ;;
  *)
    echo "Unsupported OS for protoc: $UNAME_S"
    exit 1
    ;;
esac

# Determine architecture
case "$UNAME_M" in
  arm64|aarch64)
    PROTOC_ARCH="aarch64"
    ;;
  x86_64|amd64)
    PROTOC_ARCH="x86_64"
    ;;
  *)
    echo "Unsupported architecture for protoc: $UNAME_M"
    exit 1
    ;;
esac

# Protoc binary name (matches maven protobuf plugin layout)
PROTOC_BIN="protoc-${PROTOC_VERSION}-${PROTOC_OS}-${PROTOC_ARCH}.exe"
PROTOC="$SERVER_DIR/target_dist/protoc-plugins/$PROTOC_BIN"


# Allow overriding the destination directory
TARGET_DIR="${PROTO_DEST_DIR:-$SERVER_DIR/target_dist}"
JAVA_OUT="$TARGET_DIR/generated-sources/protobuf/java"
=======
    # Find protoc (check hardcoded path from maven plugin first)
    REAL_HOME=$(eval echo ~$USER)
    MAVEN_PROTOC="$REAL_HOME/.m2/repository/com/google/protobuf/protoc/3.25.1/protoc-3.25.1-osx-x86_64.exe"
    # Try to find it in target_dist as well
PLUGIN_PROTOC="$SERVER_DIR/target_dist/protoc-plugins/protoc-3.25.1-osx-x86_64.exe"
# Local writable copy
PROTOC_EXE="$TARGET_BASE/protoc_local.exe"


# Ensure output directory exists
mkdir -p "$JAVA_OUT"

# Ensure protoc exists (downloaded by maven plugin)
if [ ! -f "$PROTOC" ]; then
  echo "Protoc not found at:"
  echo "  $PROTOC"
  echo "Attempting to download via 'mvn protobuf:compile'..."
  mvn protobuf:compile > /dev/null 2>&1
fi


# Final verification
if [ ! -f "$PROTOC" ]; then
  echo "ERROR: Protoc still not found after maven download."
  exit 1
=======
if [ -f "$PROTOC_EXE" ]; then
    echo "Generating protobuf files using $PROTOC_EXE..."
    # Generate each proto file, searching recursively
    find "$PROTO_SRC_DIR" -name "*.proto" | while read proto_file; do
        echo "Processing $proto_file..."
        "$PROTOC_EXE" --proto_path="$PROTO_SRC_DIR" --java_out="$GEN_SRC_DIR" "$proto_file"
        if [ $? -ne 0 ]; then
            echo "Error generating $proto_file"
            exit 1
        fi
    done
    # Ensure generated files are readable
    chmod -R u+rw "$GEN_SRC_DIR"

    echo "Protobuf generation successful."
else
    # Fallback to system protoc
    if command -v protoc >/dev/null 2>&1; then
        echo "Using system protoc..."
        find "$PROTO_SRC_DIR" -name "*.proto" | while read proto_file; do
            echo "Processing $proto_file..."
            protoc --proto_path="$PROTO_SRC_DIR" --java_out="$GEN_SRC_DIR" "$proto_file"
            if [ $? -ne 0 ]; then
                echo "Error generating $proto_file"
                exit 1
            fi
        done
        echo "Protobuf generation successful (via system protoc)."
    else
        echo "Error: protoc not found. Please ensure it is installed or run mvn protobuf:compile manually."
        exit 1
    fi

fi

echo "Generating protobuf files using:"
echo "  $PROTOC"

"$PROTOC" \
  --proto_path="$PROTO_ROOT" \
  --java_out="$JAVA_OUT" \
  "$PROTO_ROOT"/client/*.proto \
  "$PROTO_ROOT"/server/*.proto \
  "$PROTO_ROOT"/message.proto

echo "Protobuf compilation successful."