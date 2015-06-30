# run.sh
java -jar ../../../../vendor/jscover/target/dist/JSCover-all.jar \
-ws --document-root=../../../.. --report-dir=../../../../reports/jscover \
--no-instrument=/vendor --no-instrument=/test --no-instrument=/manual