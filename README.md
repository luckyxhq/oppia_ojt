# Oppia OJT - Development Setup

This repository is a customized fork of the [Oppia](https://github.com/oppia/oppia) project for on-the-job training purposes.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:
- **Git** installed
- **Python 3.10** or higher
- **Node.js 16.x** (will be installed automatically)
- **Yarn** package manager

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/luckyxhq/oppia_ojt.git
   cd oppia_ojt
   ```

2. **Initialize the Oppia submodule**
   ```bash
   git submodule update --init --recursive
   ```

3. **Run the installation script**
   
   The repository excludes large binary files (`oppia_tools/` and `yarn_cache/`) to comply with GitHub's size limits. These will be automatically downloaded and installed by running:
   
   ```bash
   cd oppia
   bash scripts/install_prerequisites.sh
   ```
   
   This script will:
   - Download and install Node.js 16.x
   - Download and install Elasticsearch 7.17.x
   - Install required Python dependencies
   - Set up the yarn cache
   - Install all necessary development tools

4. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start the development server**
   ```bash
   python -m scripts.start
   ```

## 📁 Repository Structure

```
oppia_ojt/
├── oppia/                    # Main Oppia codebase (submodule)
├── oppia_tools/              # Development tools (auto-generated, not in git)
├── yarn_cache/               # Yarn package cache (auto-generated, not in git)
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## ⚠️ Important Notes

### Excluded Directories

The following directories are **not tracked in git** and will be regenerated when you run the setup:

- **`oppia_tools/`** - Contains Elasticsearch, Node.js, and other development tools (~500MB+)
- **`yarn_cache/`** - Yarn package cache (~200MB+)

These are automatically created by the installation script and should not be committed to version control.

### First-Time Setup

If you're setting up the project for the first time or on a new machine:

1. The installation process may take 10-20 minutes depending on your internet connection
2. You'll need approximately **2-3 GB** of free disk space for all tools and dependencies
3. Make sure you have a stable internet connection for downloading the required tools

## 🔧 Development Workflow

### Running Tests

```bash
python -m scripts.run_tests
```

### Linting Code

```bash
python -m scripts.linters.run_lint_checks
```

### Building for Production

```bash
python -m scripts.build
```

## 🤝 Contributing

This is a training repository. When making changes:

1. Create a new branch for your feature
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

3. Push to the repository
   ```bash
   git push origin feature/your-feature-name
   ```

## 📚 Additional Resources

- [Original Oppia Documentation](https://github.com/oppia/oppia/wiki)
- [Oppia Developer Guide](https://github.com/oppia/oppia/wiki/Contributing-code-to-Oppia)

## 🆘 Troubleshooting

### "oppia_tools not found" Error

Run the installation script:
```bash
cd oppia
bash scripts/install_prerequisites.sh
```

### Port Already in Use

If you see a port conflict error, stop any running Oppia instances:
```bash
pkill -f "python -m scripts.start"
```

### Python Version Issues

Ensure you're using Python 3.10 or higher:
```bash
python --version
```

## 📝 License

This project follows the same license as the original Oppia project - Apache License 2.0.

---

**Note**: This repository is for training purposes and is not affiliated with the official Oppia Foundation.
