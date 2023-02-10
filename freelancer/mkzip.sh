#!/bin/sh

(cd $(dirname $0)/.. && git archive HEAD -o freelancer/$(git rev-parse HEAD).zip)