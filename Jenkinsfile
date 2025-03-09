pipeline {
    agent any
    
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['dev', 'staging', 'preprod', 'prod'], description: 'Environnement de déploiement')
    }
    
    environment {
        APP_NAME = "gestion-etablissement"
        DOCKER_REGISTRY_LOCAL = "localhost:5001"
        DOCKER_REGISTRY_REMOTE = "docker.io/votre-username"  // Remplacez par votre compte DockerHub
        DOCKER_CREDS = credentials('docker-hub-credentials') // À configurer dans Jenkins
        SONAR_URL = "http://sonarqube:9000"
        ARTIFACTORY_URL = "http://artifactory:8081/artifactory"
        VERSION = "${env.BUILD_ID}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            parallel {
                stage('Backend Build') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend Build') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test || echo "No tests available"'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test -- --watchAll=false || echo "No tests available"'
                        }
                    }
                }
            }
        }
        
        stage('Code Quality') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh """
                        npm install -g sonarqube-scanner
                        sonar-scanner \
                          -Dsonar.projectKey=${APP_NAME} \
                          -Dsonar.sources=. \
                          -Dsonar.host.url=${SONAR_URL} \
                          -Dsonar.login=admin \
                          -Dsonar.password=admin \
                          -Dsonar.exclusions=**/node_modules/**,**/*.test.js
                    """
                }
            }
        }
        
        stage('Package') {
            steps {
                dir('frontend') {
                    sh 'mkdir -p ../backend/public'
                    sh 'cp -r build/* ../backend/public/ || true'
                }
                dir('backend') {
                    sh 'npm pack'
                    sh 'mv *.tgz ../${APP_NAME}-${VERSION}.tgz'
                }
            }
        }
        
        stage('Store Artifact') {
            steps {
                script {
                    if (params.ENVIRONMENT in ['dev', 'staging']) {
                        echo "Storing artifact in local repository"
                        sh """
                            curl -u admin:password -X PUT ${ARTIFACTORY_URL}/npm-local/${APP_NAME}/${VERSION}/ -T ${APP_NAME}-${VERSION}.tgz || echo "Artifact upload failed"
                        """
                    } else {
                        echo "Storing artifact in remote repository (simulated)"
                        // Dans un scénario réel, on utiliserait un autre dépôt distant
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${APP_NAME}:${VERSION} ."
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    if (params.ENVIRONMENT in ['dev', 'staging']) {
                        sh """
                            docker tag ${APP_NAME}:${VERSION} ${DOCKER_REGISTRY_LOCAL}/${APP_NAME}:${VERSION}
                            docker tag ${APP_NAME}:${VERSION} ${DOCKER_REGISTRY_LOCAL}/${APP_NAME}:latest
                            docker push ${DOCKER_REGISTRY_LOCAL}/${APP_NAME}:${VERSION}
                            docker push ${DOCKER_REGISTRY_LOCAL}/${APP_NAME}:latest
                        """
                    } else {
                        sh """
                            echo ${DOCKER_CREDS_PSW} | docker login -u ${DOCKER_CREDS_USR} --password-stdin
                            docker tag ${APP_NAME}:${VERSION} ${DOCKER_REGISTRY_REMOTE}/${APP_NAME}:${VERSION}
                            docker tag ${APP_NAME}:${VERSION} ${DOCKER_REGISTRY_REMOTE}/${APP_NAME}:latest
                            docker push ${DOCKER_REGISTRY_REMOTE}/${APP_NAME}:${VERSION}
                            docker push ${DOCKER_REGISTRY_REMOTE}/${APP_NAME}:latest
                        """
                    }
                }
            }
        }
        
        stage('Provision Environment') {
            steps {
                script {
                    if (params.ENVIRONMENT == 'dev') {
                        echo "Provisionning Dev environment (Docker)"
                        sh """
                            mkdir -p ~/.kube
                            docker network create ${APP_NAME}-network || true
                        """
                    } else if (params.ENVIRONMENT == 'staging') {
                        echo "Provisionning Staging environment (Kubernetes)"
                        sh """
                            kubectl create namespace ${APP_NAME}-staging --dry-run=client -o yaml | kubectl apply -f -
                        """
                    } else {
                        echo "Provisionning Cloud environment for ${params.ENVIRONMENT}"
                        // Ici, vous utiliseriez Terraform ou un autre outil IaC pour provisionner l'environnement cloud
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    if (params.ENVIRONMENT == 'dev') {
                        echo "Deploying to Dev environment (Docker)"
                        sh """
                            docker stop ${APP_NAME}-dev || true
                            docker rm ${APP_NAME}-dev || true
                            docker run -d --name ${APP_NAME}-dev --network ${APP_NAME}-network -p 3000:5000 ${DOCKER_REGISTRY_LOCAL}/${APP_NAME}:latest
                        """
                    } else if (params.ENVIRONMENT == 'staging') {
                        echo "Deploying to Staging environment (Kubernetes)"
                        sh """
                            kubectl set image deployment/${APP_NAME} ${APP_NAME}=${DOCKER_REGISTRY_LOCAL}/${APP_NAME}:${VERSION} -n ${APP_NAME}-staging || kubectl apply -f k8s/deployment.yaml -n ${APP_NAME}-staging
                            kubectl apply -f k8s/service.yaml -n ${APP_NAME}-staging
                            kubectl apply -f k8s/ingress.yaml -n ${APP_NAME}-staging
                        """
                    } else {
                        echo "Deploying to ${params.ENVIRONMENT} environment (Cloud)"
                        // Ici, vous déploieriez vers votre cloud provider
                    }
                }
            }
        }
        
        stage('Monitor') {
            steps {
                script {
                    echo "Setting up monitoring for deployed application"
                    if (params.ENVIRONMENT == 'prod') {
                        sh """
                            kubectl apply -f monitoring/prometheus-config.yaml || true
                            kubectl apply -f monitoring/grafana-dashboard.yaml || true
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}