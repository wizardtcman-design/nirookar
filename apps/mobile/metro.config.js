/**
 * پیکربندی Metro برای Monorepo — اجازه مصرف packages/shared از اپ موبایل.
 * الگوی رسمی مستندات Expo برای ریپازیتوری‌های چندپکیجی.
 */
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// ۱) ریشه Monorepo را زیر نظر بگیر تا تغییرات packages/shared هات‌ریلود شود
config.watchFolders = [workspaceRoot];

// ۲) حل ماژول‌ها از node_modules اپ و ریشه
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

module.exports = config;
