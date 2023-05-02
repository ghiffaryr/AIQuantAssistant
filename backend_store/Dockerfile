FROM openjdk:11-oracle

COPY target/dependency-jars /run/dependency-jars

ADD target/application.jar /run/application.jar

ENTRYPOINT java -jar run/application.jar -D exec.mainClass="com.ghiffaryr.store.StartApplication"