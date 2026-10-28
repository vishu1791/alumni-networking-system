package com.pict.alumuniconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

@SpringBootApplication
public class AlumuniConnectApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(AlumuniConnectApplication.class, args);
    }

    /**
     * Automatically loads .env file properties into System properties
     * so that Spring Boot can read Supabase credentials seamlessly.
     */
    private static void loadDotEnv() {
        File[] candidateFiles = new File[]{
                new File(".env"),
                new File("backend/.env"),
                new File("../backend/.env")
        };

        for (File envFile : candidateFiles) {
            if (envFile.exists() && envFile.isFile()) {
                try (FileInputStream fis = new FileInputStream(envFile)) {
                    Properties props = new Properties();
                    props.load(fis);
                    props.forEach((key, value) -> {
                        String k = key.toString().trim();
                        String v = value.toString().trim();
                        if (System.getProperty(k) == null && System.getenv(k) == null) {
                            System.setProperty(k, v);
                        }
                    });
                    System.out.println("Loaded environment credentials from: " + envFile.getAbsolutePath());
                    break;
                } catch (IOException e) {
                    System.err.println("Notice: Could not read .env file: " + e.getMessage());
                }
            }
        }
    }
}
