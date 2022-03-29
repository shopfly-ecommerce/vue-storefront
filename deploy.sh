#! /bin/bash

WEB_PATH=$PWD
cd $WEB_PATH

# 更新git代码
if [[ "$1" == "git-pull" ]];then
  echo "拉取最新的代码..."
  git reset --hard origin/master
  git clean -f
  git pull origin master
  git pull
  echo -e "\033[32m代码拉取完成...\033[0m"
fi

# 拷贝公共文件
if [[ "$1" == "copy" ]];then
  echo -e "\033[32m拷贝命令已放弃，如ui-components内有修改，请执行upgrade-components命令。ui-domain、ui-utils修改后重启项目即可生效 \033[0m"
fi

# 部署ui-tools
if [[ "$1" == "upgrade-components" ]];then
  echo "正在部署ui-tools..."
  cd $WEB_PATH/manager-admin
  yarn upgrade ui-components
  cd $WEB_PATH/manager-seller
  yarn upgrade ui-components
  echo -e "\033[32mui-components已部署完成...\033[0m"
fi

# 部署nodejs、nginx、pm2
if [[ "$1" == "base" ]];then
  # 移除yum lock
  rm -f /var/run/yum.pid

  # 关闭防火墙
  systemctl stop firewalld
  systemctl disable firewalld

  # 安装nodejs
  cd /usr/local/
  wget https://npm.taobao.org/mirrors/node/v12.16.2/node-v12.16.2-linux-x64.tar.gz
  tar -zxvf node-v12.16.2-linux-x64.tar.gz
  rm -rf node-v12.16.2-linux-x64.tar.gz
  mv node-v12.16.2-linux-x64 node
  echo 'export NODE_HOME=/usr/local/node
export PATH=$NODE_HOME/bin:$PATH'>>/etc/profile
  source /etc/profile

  # node npm 链接
  sudo ln -s /usr/local/node/bin/node /usr/bin/node
  sudo ln -s /usr/local/node/bin/node /usr/lib/node
  sudo ln -s /usr/local/node/bin/npm /usr/bin/npm

  # 安装yarn
  npm install yarn -g --registry=https://registry.npm.taobao.org

  # 安装pm2
  npm install pm2 -g --registry=https://registry.npm.taobao.org

  # pm2 链接
  sudo ln -s /usr/local/node/bin/pm2 /usr/bin/pm2
  sudo ln -s /usr/local/node/bin/pm2 /usr/lib/pm2
  sudo ln -s /usr/local/node/bin/yarn /usr/bin/yarn
  sudo ln -s /usr/local/node/bin/yarn /usr/lib/yarn

  # nginx安装
  yum install -y gcc gcc-c++
  yum install -y pcre pcre-devel
  yum install -y zlib zlib-devel
  yum install -y openssl openssl-devel

  cd /usr/local
  wget https://nginx.org/download/nginx-1.14.0.tar.gz
  tar -zxvf nginx-1.14.0.tar.gz
  cd nginx-1.14.0
  ./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
  make && make install
  cd ..
  rm -rf nginx-1.14.0.tar.gz
  rm -rf nginx-1.14.0
fi

if [[ ! -n "$1" || "$1" == "manager-seller" ]];then
  echo "开始部署商家中心(manager-seller)..."
  cd $WEB_PATH/manager-seller
  rm -rf node_modules
  echo "开始安装项目依赖..."
  yarn --registry=https://registry.npm.taobao.org
  echo "开始打包..."
  yarn run build:prod
  echo -e "\033[32m商家中心部署完成...\033[0m"
fi

if [[ ! -n "$1" || "$1" == "buyer-pc" ]];then
  echo "开始部署买家PC端(buyer-pc)..."
  cd $WEB_PATH/buyer/pc
  rm -rf node_modules
  echo "开始安装项目依赖..."
  yarn --registry=https://registry.npm.taobao.org
  yarn run build
  echo -e "\033[32m买家PC端build完成\033[0m"
  # 启动买家端PC
  pm2 delete buyer-pc
  pm2 start npm --name "buyer-pc" -- run start
  echo -e "\033[32mbuyer-pc部署完成！\033[0m"
fi

