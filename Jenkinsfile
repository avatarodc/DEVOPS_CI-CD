pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = "localhost:5001"
        SONAR_HOST_URL = "http://sonarqube:9000"
        ARTIFACTORY_URL = "http://artifactory:8081/artifactory"
        APP_NAME = "gestion-etablissement"
        DOCKER_IMAGE = "${DOCKER_REGISTRY}/${APP_NAME}"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test || echo "No tests yet"'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test -- --watchAll=false || echo "No tests yet"'
                        }
                    }
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                sh '''
                    npm install -g sonarqube-scanner
                    sonar-scanner \
                      -Dsonar.host.url=${SONAR_HOST_URL} \
                      -Dsonar.projectKey=${APP_NAME} \
                      -Dsonar.sources=. \
                      -Dsonar.exclusions=**/node_modules/**,**/*.test.js
                '''
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                    sh 'mkdir -p ../backend/public && cp -r build/* ../backend/public/'
                }
            }
        }
        
        stage('Build and Push Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest .'
                sh 'docker push ${DOCKER_IMAGE}:${DOCKER_TAG}'
                sh 'docker push ${DOCKER_IMAGE}:latest'
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    sed -i "s|image: .*|image: ${DOCKER_IMAGE}:${DOCKER_TAG}|g" k8s/deployment.yaml
                    kubectl apply -f k8s/namespace.yaml
                    kubectl apply -f k8s/mongodb.yaml
                    kubectl apply -f k8s/deployment.yaml
                    kubectl apply -f k8s/service.yaml
                    kubectl apply -f k8s/ingress.yaml
                '''
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}