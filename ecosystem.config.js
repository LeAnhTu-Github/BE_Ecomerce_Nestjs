module.exports = {
  apps: [
    {
      name: 'ecommerce-backend',
      script: 'npm',
      args: 'run start:dev',
      instances: 1,
      exec_mode: 'fork',
      watch: true,
      ignore_watch: ['node_modules', 'logs', 'dist', '.git'],
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/pm2.log',
      time: true,
      max_memory_restart: '500M',
      autorestart: true,
      min_uptime: '10s',
      max_restarts: 10,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};

