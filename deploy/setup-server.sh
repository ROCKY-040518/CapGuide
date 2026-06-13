#!/bin/bash
# ═══════════════════════════════════════════════════════════
# CapGuide Linux Mint 서버 초기 설정 스크립트
# 이 스크립트를 리눅스 서버에서 sudo 권한으로 1회 실행하세요.
# ═══════════════════════════════════════════════════════════

set -e

echo "🔧 [1/5] 전용 시스템 사용자 생성..."
sudo useradd --system --shell /usr/sbin/nologin --home /home/capguide --create-home capguide || echo "사용자 이미 존재"

echo "📁 [2/5] 배포 디렉터리 생성..."
sudo mkdir -p /home/capguide/capguide
sudo chown -R capguide:capguide /home/capguide

echo "📋 [3/5] systemd 서비스 파일 설치..."
sudo cp deploy/capguide.service /etc/systemd/system/capguide.service
sudo chmod 644 /etc/systemd/system/capguide.service
sudo systemctl daemon-reload

echo "🔄 [4/5] 서비스 활성화 (부팅 시 자동 시작)..."
sudo systemctl enable capguide

echo "✅ [5/5] 초기 설정 완료!"
echo ""
echo "📌 다음 단계:"
echo "  1. /etc/systemd/system/capguide.service 파일에서 환경 변수 수정"
echo "     - GEMINI_API_KEY, DB 비밀번호 등"
echo "  2. WAR 파일을 /home/capguide/capguide/capguide.war 에 배치"
echo "  3. sudo systemctl start capguide"
echo "  4. sudo journalctl -u capguide -f  (로그 확인)"
