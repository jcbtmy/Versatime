pipeline{
    
    environment {
        
        imagename = "jcbtmy/versatime"
        
        keyName = "sshPrivateKey"

        dockerImage = ''
    }
    
    
    agent any
    
    
    
    stages{
       
        stage('Build'){
         
            steps{
                
                echo "-->Building Front End<----"
                
                 //build compile front end src
                dir("front"){
                    
                    sh "npm install"
                    sh "npm run build"
                    
                }
                
                sh "rm -r back/public/*"
                
                sh "mv front/build/ back/public/"



                echo "-->Building Docker Image<--"
                        
                dir("back"){
                        
                    script{
                            
                        dockerImage = docker.build imagename
                            
                    }
                }    
            }
        }
        
        
        stage("Deploy")
        {
            steps{
                
                echo "-->Deploying Image<--"
                    
                script {

                    sh "docker save $imagename:latest | gzip > versatime.tar.gz"
                }

                sshagent(credentials: [keyName]) {

                    sh "scp versatime.tar.gz versacall@192.168.100.67:/home/versacall/"

                    sh '''
                        ssh -tt versacall@192.168.100.67 "

                            ls

                            gzip -d versatime.tar.gz
                            docker load --input versatime.tar
                            docker-compose stop
                            docker-compose rm -f
                            docker-compose pull   
                            docker-compose up -d

                            rm versatime.tar*
                        "
                    '''
        
                }
            }
        }
        
        stage("Cleanup")
        {
            steps{

                echo "-->Cleaning Images and Workspace<--"
            
                sh "docker rmi $imagename:latest"

                sh "rm -rf *"
            }
        }
    }
}